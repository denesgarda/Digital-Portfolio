// Re-encodes a video to a sane web bitrate, no install required.
//
//   swift tools/compress.swift <input> <output> [mbps]
//
// Example — 63MB export down to roughly 12MB:
//   swift tools/compress.swift big.mp4 small.mp4 3
//
// Keeps the original resolution and orientation. Default 3 Mbps, which is
// a good target for 1080x1920 talking-head footage. Phone exports are often
// 15 Mbps or higher, which is invisible on a phone screen and just makes
// the page slow.

import AVFoundation
import Foundation

let args = CommandLine.arguments
guard args.count >= 3 else {
  print("usage: swift compress.swift <input> <output> [mbps]")
  exit(1)
}
let inURL  = URL(fileURLWithPath: (args[1] as NSString).expandingTildeInPath)
let outURL = URL(fileURLWithPath: (args[2] as NSString).expandingTildeInPath)
let mbps   = args.count > 3 ? (Double(args[3]) ?? 3.0) : 3.0

guard FileManager.default.fileExists(atPath: inURL.path) else {
  print("no file at \(inURL.path)"); exit(1)
}
try? FileManager.default.removeItem(at: outURL)

let asset = AVURLAsset(url: inURL)
guard let vTrack = asset.tracks(withMediaType: .video).first else {
  print("no video track found"); exit(1)
}
let aTrack = asset.tracks(withMediaType: .audio).first

let natural = vTrack.naturalSize
let reader = try AVAssetReader(asset: asset)
let writer = try AVAssetWriter(outputURL: outURL, fileType: .mp4)

// ---- video ----
let vOut = AVAssetReaderTrackOutput(track: vTrack, outputSettings: [
  kCVPixelBufferPixelFormatTypeKey as String: Int(kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange)
])
vOut.alwaysCopiesSampleData = false
reader.add(vOut)

let vIn = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264,
  AVVideoWidthKey: Int(natural.width),
  AVVideoHeightKey: Int(natural.height),
  AVVideoCompressionPropertiesKey: [
    AVVideoAverageBitRateKey: Int(mbps * 1_000_000),
    AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
    AVVideoAllowFrameReorderingKey: true
  ]
])
vIn.expectsMediaDataInRealTime = false
vIn.transform = vTrack.preferredTransform   // keeps portrait upright
writer.add(vIn)

// ---- audio ----
var aOut: AVAssetReaderTrackOutput?
var aIn: AVAssetWriterInput?
if let aTrack = aTrack {
  let o = AVAssetReaderTrackOutput(track: aTrack, outputSettings: [
    AVFormatIDKey: kAudioFormatLinearPCM,
    AVLinearPCMBitDepthKey: 16,
    AVLinearPCMIsFloatKey: false,
    AVLinearPCMIsBigEndianKey: false,
    AVLinearPCMIsNonInterleaved: false
  ])
  o.alwaysCopiesSampleData = false
  reader.add(o)
  aOut = o

  let i = AVAssetWriterInput(mediaType: .audio, outputSettings: [
    AVFormatIDKey: kAudioFormatMPEG4AAC,
    AVNumberOfChannelsKey: 2,
    AVSampleRateKey: 44100,
    AVEncoderBitRateKey: 128_000
  ])
  i.expectsMediaDataInRealTime = false
  writer.add(i)
  aIn = i
}

guard reader.startReading() else {
  print("could not read: \(reader.error?.localizedDescription ?? "unknown")"); exit(1)
}
guard writer.startWriting() else {
  print("could not write: \(writer.error?.localizedDescription ?? "unknown")"); exit(1)
}
writer.startSession(atSourceTime: .zero)

let group = DispatchGroup()

group.enter()
vIn.requestMediaDataWhenReady(on: DispatchQueue(label: "video")) {
  while vIn.isReadyForMoreMediaData {
    guard reader.status == .reading, let buf = vOut.copyNextSampleBuffer() else {
      vIn.markAsFinished(); group.leave(); return
    }
    vIn.append(buf)
  }
}

if let aIn = aIn, let aOut = aOut {
  group.enter()
  aIn.requestMediaDataWhenReady(on: DispatchQueue(label: "audio")) {
    while aIn.isReadyForMoreMediaData {
      guard reader.status == .reading, let buf = aOut.copyNextSampleBuffer() else {
        aIn.markAsFinished(); group.leave(); return
      }
      aIn.append(buf)
    }
  }
}

group.wait()

let done = DispatchSemaphore(value: 0)
writer.finishWriting { done.signal() }
done.wait()

if writer.status != .completed {
  print("encode failed: \(writer.error?.localizedDescription ?? "unknown")")
  exit(1)
}

func mb(_ url: URL) -> Double {
  let n = (try? FileManager.default.attributesOfItem(atPath: url.path)[.size] as? Int) ?? 0
  return Double(n ?? 0) / 1_048_576
}
print(String(format: "%.1f MB → %.1f MB", mb(inURL), mb(outURL)))
