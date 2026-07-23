"use client";

import {
  Camera,
  CircleAlert,
  Loader2,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
    () =>
      `claimeat-business-scanner-${Math.random()
        .toString(16)
        .slice(2)}`,
    [],
  );

  const scannerRef =
    useRef<any>(null);

  const hasScannedRef =
    useRef(false);

  const [started, setStarted] =
    useState(false);

  const [starting, setStarting] =
    useState(false);

  const [cameras, setCameras] =
    useState<CameraDevice[]>([]);

  const [
    selectedCameraId,
    setSelectedCameraId,
  ] = useState("");

  const [error, setError] =
    useState<string | null>(null);

  async function stopScanner() {
    try {
      if (
        scannerRef.current?.isScanning
      ) {
        await scannerRef.current.stop();
      }

      if (scannerRef.current) {
        await scannerRef.current.clear();
      }
    } catch {
      // Ignore cleanup errors.
    } finally {
      scannerRef.current = null;
      setStarted(false);
    }
  }

  async function handleClose() {
    await stopScanner();
    onClose();
  }

  async function startCamera(
    cameraIdOverride?: string,
  ) {
    setStarting(true);
    setError(null);
    hasScannedRef.current = false;

    try {
      if (
        !navigator.mediaDevices
          ?.getUserMedia
      ) {
        throw new Error(
          "Camera is not available in this browser.",
        );
      }

      const permissionStream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: true,
          },
        );

      permissionStream
        .getTracks()
        .forEach((track) =>
          track.stop(),
        );

      const { Html5Qrcode } =
        await import("html5-qrcode");

      const availableCameras =
        await Html5Qrcode.getCameras();

      const mappedCameras =
        availableCameras.map(
          (camera: any, index: number) => ({
            id: camera.id,
            label:
              camera.label ||
              `Camera ${index + 1}`,
          }),
        );

      setCameras(mappedCameras);

      const preferredCamera =
        cameraIdOverride ||
        selectedCameraId ||
        mappedCameras.find((camera) =>
          camera.label
            .toLowerCase()
            .includes("back"),
        )?.id ||
        mappedCameras.find((camera) =>
          camera.label
            .toLowerCase()
            .includes("rear"),
        )?.id ||
        mappedCameras[0]?.id;

      if (!preferredCamera) {
        throw new Error(
          "No camera was found.",
        );
      }

      setSelectedCameraId(
        preferredCamera,
      );

      await stopScanner();

      const scanner = new Html5Qrcode(
        scannerId,
        {
          verbose: false,
        },
      );

      scannerRef.current = scanner;

      await scanner.start(
        preferredCamera,
        {
          fps: 10,
          qrbox: {
            width: 220,
            height: 220,
          },
          aspectRatio: 1,
        },
        async (
          decodedText: string,
        ) => {
          if (
            busy ||
            hasScannedRef.current
          ) {
            return;
          }

          hasScannedRef.current = true;

          await stopScanner();

          onCode(decodedText);
        },
        () => {
          // Ignore individual scan misses.
        },
      );

      setStarted(true);
    } catch (cameraError) {
      await stopScanner();

      setError(
        cameraError instanceof Error
          ? cameraError.message
          : "Could not start camera.",
      );
    } finally {
      setStarting(false);
    }
  }

  async function changeCamera(
    cameraId: string,
  ) {
    setSelectedCameraId(cameraId);
    await startCamera(cameraId);
  }

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;

      void stopScanner();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[2147483600] overflow-y-auto bg-[#111611] text-white">
      <div
        className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col px-4"
        style={{
          paddingTop:
            "max(14px, env(safe-area-inset-top))",
          paddingBottom:
            "max(18px, env(safe-area-inset-bottom))",
        }}
      >
        <header className="flex min-h-12 items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/45">
              ClaimEat Business
            </p>

            <h1 className="mt-1 text-xl font-black">
              Scan pickup QR
            </h1>
          </div>

          <button
            type="button"
            onClick={() =>
              void handleClose()
            }
            className="grid h-11 w-11 place-items-center rounded-full bg-white/10"
            aria-label="Close QR scanner"
          >
            <X
              size={20}
              aria-hidden="true"
            />
          </button>
        </header>

        <p className="mt-3 text-sm leading-5 text-white/55">
          Place the customer QR inside the
          square. It will be collected
          automatically after a successful
          scan.
        </p>

        {cameras.length > 1 ? (
          <select
            value={selectedCameraId}
            onChange={(event) =>
              void changeCamera(
                event.target.value,
              )
            }
            className="mt-4 min-h-11 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-sm font-semibold text-white outline-none"
            aria-label="Select camera"
          >
            {cameras.map((camera) => (
              <option
                key={camera.id}
                value={camera.id}
                className="text-black"
              >
                {camera.label}
              </option>
            ))}
          </select>
        ) : null}

        <div className="relative mt-5 aspect-square w-full overflow-hidden rounded-[1.6rem] bg-black shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div
            id={scannerId}
            className="business-qr-reader absolute inset-0 h-full w-full overflow-hidden bg-black"
          />

          {!started ? (
            <div className="absolute inset-0 z-10 grid place-items-center bg-[#192019] p-6 text-center">
              <div>
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/10">
                  {starting ? (
                    <Loader2
                      size={30}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Camera
                      size={30}
                      aria-hidden="true"
                    />
                  )}
                </span>

                <h2 className="mt-5 text-xl font-black">
                  {starting
                    ? "Starting camera…"
                    : "Camera required"}
                </h2>

                <p className="mx-auto mt-2 max-w-xs text-sm leading-5 text-white/50">
                  Allow camera access to
                  scan the customer ticket.
                </p>

                {!starting ? (
                  <button
                    type="button"
                    onClick={() =>
                      void startCamera()
                    }
                    className="mt-5 min-h-12 rounded-full bg-[#E9EDDD] px-6 text-sm font-black text-[#18392B]"
                  >
                    Enable camera
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {started ? (
            <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
              <div className="h-[220px] w-[220px] rounded-[1.2rem] border-2 border-white shadow-[0_0_0_999px_rgba(0,0,0,0.24)]" />
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="mt-4 flex gap-3 rounded-xl bg-[#4C241B] p-4 text-[#FFD8CC]">
            <CircleAlert
              size={20}
              className="shrink-0"
              aria-hidden="true"
            />

            <div>
              <p className="font-black">
                Camera did not start
              </p>

              <p className="mt-1 text-sm leading-5 opacity-80">
                {error}
              </p>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() =>
            void handleClose()
          }
          className="mt-auto min-h-12 w-full rounded-full border border-white/15 px-5 text-sm font-black text-white/75"
        >
          Enter code manually
        </button>
      </div>
    </div>
  );
}
