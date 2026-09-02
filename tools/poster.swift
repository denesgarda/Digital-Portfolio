// Grabs one exact frame from a video and saves it as that video's poster —
// the still shown on the tile before anyone presses play.
//
//   swift tools/poster.swift <video> <seconds> [output.jpg]
//
// Output defaults to the video's own path with a .jpg extension, which is the
// naming the site expects:
//
//   swift tools/poster.swift assets/work/03.mp4 12.4
//     → writes assets/work/03.jpg
//
// To find the timestamp you want, dump frames first and look at the filenames:
//
//   swift tools/frames.swift assets/work/03.mp4 ~/Desktop/pick 30
//
// Each file is named with its timestamp (frame_07_12.40s.jpg), so open the
// folder in Finder, pick the one you like, and pass its number back here.

import AVFoundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers
import Foundation

let args = CommandLine.arguments
guard args.count >= 3, let seconds = Double(args[2]) else {
  print("usage: swift poster.swift <video> <seconds> [output.jpg]")
  exit(1)
}

let videoURL = URL(fileURLWithPath: (args[1] as NSString).expandingTildeInPath)
let outURL: URL = args.count > 3
  ? URL(fileURLWithPath: (args[3] as NSString).expandingTildeInPath)
  : videoURL.deletingPathExtension().appendingPathExtension("jpg")

guard FileManager.default.fileExists(atPath: videoURL.path) else {
  print("no file at \(videoURL.path)"); exit(1)
}

let asset = AVURLAsset(url: videoURL)
let duration = CMTimeGetSeconds(asset.duration)
guard duration.isFinite, duration > 0 else {
  print("could not read a duration — is this a video file?"); exit(1)
}
guard seconds >= 0, seconds <= duration else {
  print(String(format: "%.2fs is outside this video (0 to %.2fs)", seconds, duration))
  exit(1)
}

let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true   // keep portrait upright
gen.requestedTimeToleranceBefore = .zero    // land on the exact frame
gen.requestedTimeToleranceAfter  = .zero
gen.maximumSize = CGSize(width: 1080, height: 1920)

do {
  let cg = try gen.copyCGImage(at: CMTime(seconds: seconds, preferredTimescale: 600),
                               actualTime: nil)
  guard let dest = CGImageDestinationCreateWithURL(
    outURL as CFURL, UTType.jpeg.identifier as CFString, 1, nil) else {
    print("could not write to \(outURL.path)"); exit(1)
  }
  CGImageDestinationAddImage(dest, cg,
    [kCGImageDestinationLossyCompressionQuality: 0.72] as CFDictionary)
  guard CGImageDestinationFinalize(dest) else {
    print("could not finish writing the image"); exit(1)
  }

  let bytes = (try? FileManager.default.attributesOfItem(atPath: outURL.path)[.size] as? Int) ?? 0
  print(String(format: "%@ at %.2fs → %@ (%dx%d, %.0f KB)",
               videoURL.lastPathComponent, seconds, outURL.path,
               cg.width, cg.height, Double(bytes ?? 0) / 1024))
} catch {
  print("could not read that frame: \(error.localizedDescription)")
  exit(1)
}
