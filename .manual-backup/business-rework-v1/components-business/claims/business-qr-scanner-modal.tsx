"use client";

import { Camera, CircleAlert, Loader2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type CameraDevice = {
  id: string;
  label: string;
};

export function BusinessQrScannerModal({
  onClose,
  onCode,
  busy = false,
}: {
  onClose: () => void;
  onCode: (code: string) => void;
  busy?: boolean;
}) {
  const scannerId = useMemo(
    () => `claimeat-business-scanner-${Math.random().toString(16).slice(2)}`,
    []
  );

  const scannerRef = useRef<any>(null);
  const hasScannedRef = useRef(false);

  const [started, setStarted] = useState(false);
  const [starting, setStarting] = useState(false);
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  async function stopScanner() {
    try {
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop();
      }

      if (scannerRef.current) {
        await scannerRef.current.clear();
      }
    } catch {
      // ignore cleanup errors
    } finally {
      scannerRef.current = null;
      setStarted(false);
    }
  }

  async function startCamera(cameraIdOverride?: string) {
    setStarting(true);
    setError(null);
    hasScannedRef.current = false;

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera is not available in this browser.");
      }

      const permissionStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      permissionStream.getTracks().forEach((track) => track.stop());

      const { Html5Qrcode } = await import("html5-qrcode");

      const availableCameras = await Html5Qrcode.getCameras();

      const mappedCameras = availableCameras.map((camera: any, index: number) => ({
        id: camera.id,
        label: camera.label || `Camera ${index + 1}`,
      }));

      setCameras(mappedCameras);

      const preferredCamera =
        cameraIdOverride ||
        selectedCameraId ||
        mappedCameras.find((camera) =>
          camera.label.toLowerCase().includes("back")
        )?.id ||
        mappedCameras.find((camera) =>
          camera.label.toLowerCase().includes("rear")
        )?.id ||
        mappedCameras[0]?.id;

      if (!preferredCamera) {
        throw new Error("No camera found.");
      }

      setSelectedCameraId(preferredCamera);

      await stopScanner();

      const scanner = new Html5Qrcode(scannerId, {
        verbose: false,
      });

      scannerRef.current = scanner;

      setStarted(true);

      await scanner.start(
        preferredCamera,
        {
          fps: 10,
          qrbox: {
            width: 260,
            height: 260,
          },
          aspectRatio: 1.333,
        },
        async (decodedText: string) => {
          if (busy || hasScannedRef.current) return;

          hasScannedRef.current = true;

          await stopScanner();

          onCode(decodedText);
        },
        () => {
          // ignore scan misses
        }
      );
    } catch (error) {
      setStarted(false);

      setError(
        error instanceof Error
          ? error.message
          : "Could not start camera. Check browser permissions."
      );
    } finally {
      setStarting(false);
    }
  }

  async function handleCameraChange(cameraId: string) {
    setSelectedCameraId(cameraId);
    await startCamera(cameraId);
  }

  useEffect(() => {
    return () => {
      void stopScanner();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[10000]">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-[#6F7D43]/45 backdrop-blur-xl"
        aria-label="Close scanner"
      />

      <div className="pointer-events-none relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="pointer-events-auto relative w-full max-w-lg overflow-hidden rounded-[2.25rem] bg-[#FBF8F2] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.25)] ring-1 ring-black/10 dark:bg-[#241f1a] dark:ring-white/10">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/[0.06] text-black/60 transition hover:bg-[#556235]/[0.1] hover:text-black dark:bg-white/10 dark:text-white/60 dark:hover:text-white"
            aria-label="Close"
          >
            <X size={17} />
          </button>

          <div className="pr-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF1E3] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#6F7D43] dark:bg-[#556235] dark:text-[#E1E9B8]">
              <Camera size={14} />
              Scan QR
            </div>

            <h2 className="mt-3 text-3xl font-black tracking-tight">
              Scan customer code
            </h2>

            <p className="mt-2 text-sm leading-6 text-black/55 dark:text-white/45">
              Allow camera access, then point the camera at the customer’s
              ClaimEat QR ticket.
            </p>
          </div>

          {cameras.length > 1 ? (
            <label className="mt-4 grid gap-2">
              <span className="text-xs font-black uppercase tracking-wide text-black/35 dark:text-white/30">
                Camera
              </span>

              <select
                value={selectedCameraId}
                onChange={(event) => handleCameraChange(event.target.value)}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold outline-none dark:border-white/10 dark:bg-[#171411]"
              >
                {cameras.map((camera) => (
                  <option key={camera.id} value={camera.id}>
                    {camera.label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <div className="mt-5 overflow-hidden rounded-[1.5rem] bg-[#F4EFE6] p-3 dark:bg-[#171411]">
            {!started ? (
              <div className="grid min-h-[360px] place-items-center rounded-[1.25rem] bg-white p-6 text-center dark:bg-[#241f1a]">
                <div>
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[#EEF1E3] text-[#6F7D43] dark:bg-[#556235] dark:text-[#E1E9B8]">
                    <Camera size={30} />
                  </div>

                  <p className="mt-4 text-xl font-black">
                    Camera access needed
                  </p>

                  <p className="mt-2 text-sm leading-6 text-black/50 dark:text-white/40">
                    Click below and allow camera permissions.
                  </p>

                  <button
                    type="button"
                    onClick={() => startCamera()}
                    disabled={starting}
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#6F7D43] px-6 py-3 font-black text-white transition hover:bg-[#556235] disabled:opacity-60 dark:bg-[#9baa6a] dark:text-[#2F261F]"
                  >
                    {starting ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : null}
                    {starting ? "Starting camera..." : "Enable camera"}
                  </button>
                </div>
              </div>
            ) : null}

            <div
              id={scannerId}
              className={[
                "overflow-hidden rounded-[1.25rem] bg-black",
                started ? "block min-h-[360px]" : "hidden",
              ].join(" ")}
              style={{
                width: "100%",
                minHeight: started ? "360px" : "0px",
              }}
            />
          </div>

          {error ? (
            <div className="mt-4 rounded-[1.5rem] bg-[#fff0ea] p-4 text-[#8a3a20]">
              <div className="flex gap-3">
                <CircleAlert size={20} />
                <div>
                  <p className="font-black">Camera did not start</p>
                  <p className="mt-1 text-sm font-semibold leading-6">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <p className="mt-4 text-center text-xs font-semibold text-black/35 dark:text-white/30">
            Camera works on localhost or HTTPS. If Firefox gets stuck, refresh
            and try Chrome.
          </p>
        </div>
      </div>
    </div>
  );
}
