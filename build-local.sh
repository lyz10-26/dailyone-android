#!/usr/bin/env bash
set -euo pipefail
project="$(cd "$(dirname "$0")" && pwd)"
toolchain="${ANDROID_LOCAL_TOOLS:?Set to Android SDK platform/build-tools + ecj root}"
build="$project/build"
mkdir -p "$build" "$project/../out"
rm -rf "$build/classes" "$build/dex"
mkdir -p "$build/classes" "$build/dex"
java -jar "$toolchain/ecj.jar" -8 -warn:none -bootclasspath "$toolchain/android-35/android.jar:$toolchain/android-15/core-lambda-stubs.jar" -d "$build/classes" "$project"/app/src/main/java/cn/pi/dailyone/*.java
"$toolchain/android-15/aapt" package -f -M "$project/app/src/main/AndroidManifest.xml" -S "$project/app/src/main/res" -I "$toolchain/android-35/android.jar" -A "$project/app/src/main/assets" -F "$build/unsigned.apk"
python3 - "$build" <<'PY'
import zipfile,pathlib,sys
p=pathlib.Path(sys.argv[1])
with zipfile.ZipFile(p/'classes.jar','w') as z:
 for f in (p/'classes').rglob('*.class'):z.write(f,str(f.relative_to(p/'classes')))
PY
"$toolchain/android-15/d8" --min-api 26 --lib "$toolchain/android-35/android.jar" --output "$build/dex" "$build/classes.jar"
(cd "$build/dex" && "$toolchain/android-15/aapt" add "$build/unsigned.apk" classes.dex)
"$toolchain/android-15/zipalign" -f -p 4 "$build/unsigned.apk" "$build/aligned.apk"
# Dedicated project key. Retain privately to sign future updates.
if [ ! -f "$project/../private/dailyone.jks" ]; then
 mkdir -p "$project/../private"; chmod 700 "$project/../private"
 keytool -genkeypair -keystore "$project/../private/dailyone.jks" -storepass android -keypass android -alias dailyone -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=DailyOne, O=Pi" >/dev/null 2>&1
 chmod 600 "$project/../private/dailyone.jks"
fi
"$toolchain/android-15/apksigner" sign --ks "$project/../private/dailyone.jks" --ks-pass pass:android --out "$project/../out/DailyOne-1.4.0.apk" "$build/aligned.apk"
"$toolchain/android-15/apksigner" verify --verbose "$project/../out/DailyOne-1.4.0.apk"
"$toolchain/android-15/zipalign" -c 4 "$project/../out/DailyOne-1.4.0.apk"
