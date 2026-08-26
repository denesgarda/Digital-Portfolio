// Pulls evenly-spaced still frames out of a video, no install required.
//
//   swift tools/frames.swift <video> <output-folder> [how-many] [start] [end]
//
// Whole clip:
//   swift tools/frames.swift ~/Desktop/bottle.mov ~/Desktop/frames 12
//
// Just the hook, densely — 10 frames across the first 3 seconds:
//   swift tools/frames.swift ~/Desktop/bottle.mov ~/Desktop/hook 10 0 3
//
// Writes numbered JPEGs named with their timestamp, plus prints the clip's
// duration and dimensions. Useful for reviewing a cut frame by frame.

import AVFoundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers
import Foundation

let args = CommandLine.arguments
guard args.count >= 3 else {
  print("usage: swift frames.swift <video> <output-folder> [how-many] [start] [end]")
  exit(1)
}

let videoURL = URL(fileURLWithPath: (args[1] as NSString).expandingTildeInPath)
let outDir   = URL(fileURLWithPath: (args[2] as NSString).expandingTildeInPath)
let count    = args.count > 3 ? (Int(args[3]) ?? 12) : 12

guard FileManager.default.fileExists(atPath: videoURL.path) else {
  print("no file at \(videoURL.path)")
  exit(1)
}
try? FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)

let asset = AVURLAsset(url: videoURL)
let duration = CMTimeGetSeconds(asset.duration)
guard duration.isFinite, duration > 0 else {
  print("could not read a duration — is this a video file?")
  exit(1)
}

if let track = asset.tracks(withMediaType: .video).first {
  let s = track.naturalSize.applying(track.preferredTransform)
  print(String(format: "duration %.2fs · %dx%d", duration, Int(abs(s.width)), Int(abs(s.height))))
} else {
  print(String(format: "duration %.2fs", duration))
}

let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true          // respect portrait orientation
gen.requestedTimeToleranceBefore = .zero           // land on the exact timestamp
gen.requestedTimeToleranceAfter  = .zero
gen.maximumSize = CGSize(width: 720, height: 1600) // keep files small

// Optional window, so you can sample the hook densely instead of the whole clip.
let start = args.count > 4 ? (Double(args[4]) ?? 0) : 0
let end   = args.count > 5 ? min(Double(args[5]) ?? duration, duration) : duration
guard end > start else {
  print("end must be after start")
  exit(1)
}
if start > 0 || end < duration {
  print(String(format: "sampling %.2fs – %.2fs", start, end))
}

var written = 0
for i in 0..<count {
  let target = start + (end - start) * Double(i) / Double(max(count - 1, 1))
  let clamped = min(target, max(duration - 0.05, 0))
  let time = CMTime(seconds: clamped, preferredTimescale: 600)
  do {
    let cg = try gen.copyCGImage(at: time, actualTime: nil)
    let name = String(format: "frame_%02d_%05.2fs.jpg", i, clamped)
    let url = outDir.appendingPathComponent(name)
    guard let dest = CGImageDestinationCreateWithURL(
      url as CFURL, UTType.jpeg.identifier as CFString, 1, nil) else { continue }
    CGImageDestinationAddImage(dest, cg,
      [kCGImageDestinationLossyCompressionQuality: 0.72] as CFDictionary)
    if CGImageDestinationFinalize(dest) { written += 1 }
  } catch {
    print("frame \(i) at \(String(format: "%.2f", clamped))s failed: \(error.localizedDescription)")
  }
}

print("wrote \(written) frames to \(outDir.path)")
