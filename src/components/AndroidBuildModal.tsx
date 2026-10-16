import React, { useState } from 'react';
import { X, Smartphone, CheckCircle, Terminal, ShieldCheck, Cpu, Code2 } from 'lucide-react';

interface AndroidBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'fa' | 'en';
}

export const AndroidBuildModal: React.FC<AndroidBuildModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'gradle' | 'manifest' | 'github'>('guide');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const isFa = lang === 'fa';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#1a1512] border border-[#5a4630] rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3a322b] bg-gradient-to-r from-[#241e19] to-[#1c1815]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Smartphone size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-amber-300">
                  {isFa ? 'مرکز خروجی اندروید، گریدل و انتشار APK / AAB' : 'Android Gradle & APK / AAB Release Center'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  Google Play & کافه بازار
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {isFa
                  ? 'بررسی معماری نیتیو، اسکریپت‌های Gradle و راهنمای گام‌به‌گام دریافت فایل خروجی APK'
                  : 'Native architecture overview, Gradle configs & step-by-step APK build guide'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#3a322b] bg-[#14100d] px-4 pt-2 gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-2 px-3 rounded-t-lg font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-amber-400 text-amber-300 bg-[#1e1914]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Cpu size={14} />
            {isFa ? 'راهنمای دریافت خروجی (۳ روش)' : 'Build Guide (3 Methods)'}
          </button>
          <button
            onClick={() => setActiveTab('gradle')}
            className={`py-2 px-3 rounded-t-lg font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'gradle'
                ? 'border-amber-400 text-amber-300 bg-[#1e1914]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Code2 size={14} />
            {isFa ? 'فایل‌های Gradle پروژه' : 'Project Gradle Files'}
          </button>
          <button
            onClick={() => setActiveTab('manifest')}
            className={`py-2 px-3 rounded-t-lg font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'manifest'
                ? 'border-amber-400 text-amber-300 bg-[#1e1914]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShieldCheck size={14} />
            {isFa ? 'مانیفست و پل جاوا' : 'Manifest & Java Bridge'}
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`py-2 px-3 rounded-t-lg font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'github'
                ? 'border-amber-400 text-amber-300 bg-[#1e1914]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Terminal size={14} />
            {isFa ? 'ساخت خودکار ابری (GitHub Actions)' : 'Cloud Build (GitHub Actions)'}
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm text-stone-300">
          {activeTab === 'guide' && (
            <div className="space-y-4">
              {/* Note about cloud container vs Android SDK */}
              <div className="bg-amber-950/40 border border-amber-600/40 rounded-xl p-3.5 text-xs text-amber-200/90 leading-relaxed">
                <span className="font-bold text-amber-300">💡 {isFa ? 'نکته بسیار مهم درباره فایل گریدل و ساخت APK:' : 'Crucial note regarding Gradle & APK build:'}</span>{' '}
                {isFa
                  ? 'محیط پیش‌نمایش فعلی در سرور وب، یک کانتینر Node.js برای اجرای زنده است و بسته چند گیگابایتی Android SDK در این کانتینر نصب نیست. به همین دلیل ساخت فایل نهایی .apk درون این صفحه وب اتفاق نمی‌افتد؛ اما ساختار پروژه اندروید با تمام فایل‌های build.gradle، settings.gradle، MainActivity.java و مانیفست درون همین ریپازیتوری آماده شده است. شما از ۳ مسیر زیر می‌توانید در چند دقیقه فایل نهایی APK یا بسته AAB گوگل‌پلی را تحویل بگیرید:'
                  : 'This web container runs Node.js/Vite for live execution and does not host the multi-gigabyte Android SDK. The native Gradle project (build.gradle, settings.gradle, MainActivity.java, AndroidManifest.xml) is fully configured in this repo. You can generate your production APK/AAB through any of these 3 routes:'}
              </div>

              {/* Method 1: GitHub Actions (Recommended) */}
              <div className="bg-[#241e19] border border-[#3a322b] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">۱</span>
                    <h4 className="font-bold text-amber-300 text-sm">
                      {isFa ? 'روش پیشنهادی و خودکار: گیت‌هاب اکشنز (GitHub Actions - رایگان)' : 'Method 1 (Recommended): GitHub Actions (Automated & Free)'}
                    </h4>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                    {isFa ? 'بدون نیاز به نصب نرم‌افزار' : 'No local setup required'}
                  </span>
                </div>
                <p className="text-stone-300 text-xs leading-relaxed">
                  {isFa
                    ? 'فایل گردش کار .github/workflows/build-apk.yml در پروژه شما تعبیه شده است. کافیست پروژه را در مخزن گیت‌هاب خود پوش کنید. گیت‌هاب سرور مجازی با جاوا ۱۷ و گریدل را روشن کرده، وب را کامپایل می‌کند و فایل‌های امضاشده app-release.apk و app-release.aab را در تب Actions برای دانلود مستقیم قرار می‌دهد!'
                    : 'The workflow file .github/workflows/build-apk.yml is already present. Push this repository to GitHub, and GitHub Actions automatically builds and outputs the signed app-release.apk and app-release.aab artifacts for direct download.'}
                </p>
                <div className="bg-[#14100d] p-2.5 rounded-lg font-mono text-[11px] text-amber-200/80 flex items-center justify-between">
                  <span>git push origin main → GitHub Actions → Artifacts (.apk & .aab)</span>
                  <button
                    onClick={() => handleCopy('git push origin main', 'git-push')}
                    className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer"
                  >
                    {copiedText === 'git-push' ? 'کپی شد!' : 'کپی'}
                  </button>
                </div>
              </div>

              {/* Method 2: Android Studio */}
              <div className="bg-[#241e19] border border-[#3a322b] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">۲</span>
                    <h4 className="font-bold text-amber-300 text-sm">
                      {isFa ? 'روش دوم: باز کردن مستقیم در اندروید استودیو (Android Studio)' : 'Method 2: Open directly in Android Studio'}
                    </h4>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300">
                    {isFa ? 'توسعه‌دهندگان' : 'Developers'}
                  </span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-stone-300 pr-2">
                  <li>{isFa ? 'ابتدا یک‌بار دستور npm run build را در ریشه پروژه اجرا کنید.' : 'Run npm run build once to produce the production web bundle.'}</li>
                  <li>{isFa ? 'پوشه پروژه را در Android Studio با گزینه Open Project باز کنید.' : 'Open this project root in Android Studio.'}</li>
                  <li>{isFa ? 'اندروید استودیو فایل‌های build.gradle و settings.gradle را خودکار همگام (Sync) می‌کند.' : 'Android Studio will auto-sync build.gradle and settings.gradle.'}</li>
                  <li>{isFa ? 'از منوی بالا بر روی Build > Build Bundle(s) / APK(s) > Build APK(s) کلیک کنید.' : 'Click Build > Build Bundle(s) / APK(s) > Build APK(s).'}</li>
                </ol>
              </div>

              {/* Method 3: Command Line */}
              <div className="bg-[#241e19] border border-[#3a322b] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs">۳</span>
                    <h4 className="font-bold text-amber-300 text-sm">
                      {isFa ? 'روش سوم: ساخت در خط فرمان با Gradle Wrapper' : 'Method 3: Command Line via Gradle Wrapper'}
                    </h4>
                  </div>
                </div>
                <div className="bg-[#14100d] p-3 rounded-lg font-mono text-[11px] text-emerald-300 space-y-1">
                  <div># ۱. ساخت باندل وب و انتقال به پوشه دارایی اندروید</div>
                  <div>npm run build && mkdir -p app/src/main/assets && cp -r dist/* app/src/main/assets/</div>
                  <div># ۲. کامپایل فایل APK برای کافه بازار، مایکت یا تست</div>
                  <div>./gradlew assembleRelease</div>
                  <div># ۳. کامپایل باندل AAB مخصوص گوگل‌پلی (Google Play Console)</div>
                  <div>./gradlew bundleRelease</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gradle' && (
            <div className="space-y-4">
              <div className="text-xs text-stone-400">
                {isFa
                  ? 'فایل‌های زیر به صورت آماده در ریشه و پوشه app پروژه شما وجود دارند:'
                  : 'The following Gradle files are fully configured in your project root and /app:'}
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono text-amber-300 mb-1">
                  <span>📄 app/build.gradle</span>
                  <span className="text-stone-400">Application ID: com.worldplay.game</span>
                </div>
                <pre className="bg-[#14100d] border border-stone-800 rounded-lg p-3 text-[11px] font-mono text-stone-300 overflow-x-auto max-h-56">
{`plugins {
    id 'com.android.application'
}

android {
    namespace 'com.worldplay.game'
    compileSdk 33

    defaultConfig {
        applicationId "com.worldplay.game"
        minSdk 21
        targetSdk 33
        versionCode 1
        versionName "1.4.0"
    }

    signingConfigs {
        release {
            storeFile file("release.keystore")
            storePassword "worldplay123"
            keyAlias "worldplay"
            keyPassword "worldplay123"
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
        }
    }
}`}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono text-amber-300 mb-1">
                  <span>📄 settings.gradle</span>
                  <span className="text-stone-400">Root & Modules</span>
                </div>
                <pre className="bg-[#14100d] border border-stone-800 rounded-lg p-3 text-[11px] font-mono text-stone-300 overflow-x-auto">
{`rootProject.name = "Worldplay"
include ':app'`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'manifest' && (
            <div className="space-y-4">
              <div className="text-xs text-stone-400">
                {isFa
                  ? 'تنظیمات پل نیتیو جاوا و مجوزهای اندروید (app/src/main/AndroidManifest.xml):'
                  : 'Native Java bridge and permissions in app/src/main/AndroidManifest.xml:'}
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono text-amber-300 mb-1">
                  <span>📄 app/src/main/AndroidManifest.xml</span>
                </div>
                <pre className="bg-[#14100d] border border-stone-800 rounded-lg p-3 text-[11px] font-mono text-stone-300 overflow-x-auto max-h-56">
{`<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.worldplay.game">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="همجهان"
        android:hardwareAccelerated="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">
        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono text-amber-300 mb-1">
                  <span>☕ app/src/main/java/com/worldplay/game/MainActivity.java</span>
                  <span className="text-emerald-400 text-[11px]">ویبره هپتیک نیتیو + شتاب سخت‌افزاری</span>
                </div>
                <p className="text-xs text-stone-300">
                  {isFa
                    ? 'پل جاوا (AndroidBridge) دسترسی به ویبره لمسی گوشی هنگام انجام حرکت در شطرنج، نمایش پیام‌های Toast، تمام‌صفحه بدون نوار مزاحم، و بهینه‌سازی بارگذاری آفلاین سریع را فراهم می‌کند.'
                    : 'The AndroidBridge Java class handles native haptic vibration upon chess moves, Toast notifications, immersive full-screen, and instant offline asset loading.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'github' && (
            <div className="space-y-3">
              <div className="bg-[#241e19] border border-[#3a322b] rounded-xl p-3.5 space-y-2">
                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-400" />
                  {isFa ? 'فایل گیت‌هاب اکشنز آماده است' : 'GitHub Actions Workflow Active'}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {isFa
                    ? 'فایل .github/workflows/build-apk.yml مراحل زیر را به شکل کاملاً خودکار روی سرور گیت‌هاب انجام می‌دهد:'
                    : 'The file .github/workflows/build-apk.yml automates the following on every commit or push:'}
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs text-stone-400 pr-2">
                  <li>{isFa ? 'نصب پکیج‌ها و اجرای npm run build' : 'Installs packages & runs npm run build'}</li>
                  <li>{isFa ? 'کپی خودکار خروجی وب به app/src/main/assets' : 'Transfers web dist to app/src/main/assets'}</li>
                  <li>{isFa ? 'تنظیم JDK 17 و ایجاد کلید امضای دیجیتال Keystore' : 'Sets up JDK 17 & provisions Release Keystore'}</li>
                  <li>{isFa ? 'ساخت فایل app-release.apk (مناسب برای کافه بازار و مایکت)' : 'Builds app-release.apk (Cafe Bazaar & direct install)'}</li>
                  <li>{isFa ? 'ساخت فایل app-release.aab (فرمت اجباری گوگل‌پلی)' : 'Builds app-release.aab (Google Play Bundle)'}</li>
                  <li>{isFa ? 'آپلود هر دو فایل در بخش Artifacts گیت‌هاب جهت دانلود' : 'Uploads artifacts to GitHub Actions for 1-click download'}</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#3a322b] bg-[#14100d] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="text-stone-400 flex items-center gap-2">
            <span>📦 {isFa ? 'بسته اندروید: آماده برای انتشار بین‌المللی' : 'Android Bundle: Ready for Release'}</span>
          </div>
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors cursor-pointer"
          >
            {isFa ? 'متوجه شدم، بستن پنجره' : 'Understood, Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
