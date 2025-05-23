import os
import yt_dlp

def download_audio_from_youtube_local(yt_url, output_filename="temp_podcast_audio"):
    ffmpeg_bin_directory = os.path.realpath(r"D:\Downloads\ffmpeg-7.0.2-essentials_build\ffmpeg-7.0.2-essentials_build\bin")

    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': output_filename,  # This will be the base filename (no extension)
        'noplaylist': True,
        'quiet': False,
        'verbose': True,
    }

    ffmpeg_exe = os.path.join(ffmpeg_bin_directory, "ffmpeg.exe")
    ffprobe_exe = os.path.join(ffmpeg_bin_directory, "ffprobe.exe")

    if os.path.isdir(ffmpeg_bin_directory) and os.path.isfile(ffmpeg_exe) and os.path.isfile(ffprobe_exe):
        ydl_opts['ffmpeg_location'] = ffmpeg_bin_directory
        print(f"[INFO] Using FFmpeg from explicit path: {ffmpeg_bin_directory}")
    else:
        print(f"[WARNING] FFmpeg directory ('{ffmpeg_bin_directory}') or executables not found.")
        print(f"          ffmpeg.exe exists: {os.path.isfile(ffmpeg_exe)}")
        print(f"          ffprobe.exe exists: {os.path.isfile(ffprobe_exe)}")
        print(f"[INFO] yt-dlp will attempt to find FFmpeg in your system PATH.")

    print(f"Attempting to download audio from: {yt_url}")

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([yt_url])

        final_output = output_filename + ".mp3"  # Correct final filename

        if os.path.exists(final_output) and os.path.getsize(final_output) > 0:
            print(f"Audio downloaded and saved to {final_output}")
            return final_output
        else:
            print(f"[ERROR] Output file '{final_output}' not found or empty after processing.")
            return None
    except Exception as e:
        print(f"Error downloading audio: {e}")
        return None
