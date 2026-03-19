import { useState, useRef, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCamera,
  faRotate,
  faBolt,
  faImages,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { weeklyRecipes } from "../data/sampleData";

export default function CameraOverlay({ onClose, onPublish }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(document.createElement("canvas"));

  const [facing, setFacing] = useState("environment");
  const [flashOn, setFlashOn] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [captured, setCaptured] = useState(null); // { main, selfie }
  const [capturing, setCapturing] = useState(false);
  const [caption, setCaption] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(0); // index into weeklyRecipes
  const [publishing, setPublishing] = useState(false);

  // Start camera stream — only ONE at a time (Safari compatible)
  const startCamera = useCallback(async (facingMode) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    try {
      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1080 },
          height: { ideal: 1440 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try { await videoRef.current.play(); } catch (_) {}
      }

      setCameraError(null);
      return true;
    } catch (err) {
      console.error("Camera error:", err);
      if (facingMode === "environment") {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false,
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            try { await videoRef.current.play(); } catch (_) {}
          }
          setCameraError(null);
          return true;
        } catch (_) {
          setCameraError("Camera non disponible");
          return false;
        }
      }
      setCameraError("Camera non disponible");
      return false;
    }
  }, []);

  useEffect(() => {
    startCamera(facing);
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleFlip() {
    const newFacing = facing === "environment" ? "user" : "environment";
    setFacing(newFacing);
    await startCamera(newFacing);
  }

  function captureFrame() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return null;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.85);
  }

  async function handleCapture() {
    setShowFlash(true);
    setCapturing(true);
    setTimeout(() => setShowFlash(false), 300);

    const mainImg = captureFrame();
    const selfieFacing = facing === "environment" ? "user" : "environment";
    const success = await startCamera(selfieFacing);

    if (success) {
      await new Promise((resolve) => {
        const checkVideo = () => {
          if (videoRef.current && videoRef.current.videoWidth > 0) {
            resolve();
          } else {
            requestAnimationFrame(checkVideo);
          }
        };
        setTimeout(checkVideo, 400);
      });

      const selfieImg = captureFrame();
      setCaptured({
        main: facing === "environment" ? mainImg : selfieImg,
        selfie: facing === "environment" ? selfieImg : mainImg,
      });
    } else {
      setCaptured({ main: mainImg, selfie: mainImg });
    }

    setCapturing(false);
  }

  async function handleRetake() {
    setCaptured(null);
    setCaption("");
    await startCamera(facing);
  }

  function handlePublish() {
    if (!captured) return;
    setPublishing(true);
    const recipe = weeklyRecipes[selectedRecipe];
    // Simulate a brief publish delay
    setTimeout(() => {
      onPublish({
        mainImage: captured.main,
        selfieImage: captured.selfie,
        caption: caption || "Mon plat du jour ! 🍽️",
        recipeId: recipe.id,
      });
    }, 400);
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-camera-open">
      {/* Shutter flash */}
      {showFlash && (
        <div className="absolute inset-0 z-[210] bg-white animate-shutter-flash pointer-events-none" />
      )}

      {/* Publishing overlay */}
      {publishing && (
        <div className="absolute inset-0 z-[210] bg-black/60 flex items-center justify-center">
          <div className="text-center animate-fade-in-up">
            <div className="w-12 h-12 rounded-full bg-[#005b52] flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faPaperPlane} className="text-white text-lg" />
            </div>
            <p className="text-white font-semibold">Publication...</p>
          </div>
        </div>
      )}

      {/* Main camera view */}
      <div className="flex-1 relative overflow-hidden">
        {captured ? (
          <>
            <img src={captured.main} alt="Plat" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute top-14 left-4 w-[100px] h-[130px] rounded-2xl overflow-hidden border-2 border-white/40 shadow-lg z-10">
              <img src={captured.selfie} alt="Selfie" className="w-full h-full object-cover" />
            </div>
          </>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover ${facing === "user" ? "scale-x-[-1]" : ""}`}
            />

            {capturing && (
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-5 py-3">
                  <p className="text-white text-sm font-medium">Selfie en cours...</p>
                </div>
              </div>
            )}

            {!capturing && (
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-white/10" />
                ))}
              </div>
            )}

            {!capturing && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-white/25 pointer-events-none" />
            )}
          </>
        )}

        {cameraError && !captured && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <FontAwesomeIcon icon={faCamera} className="text-white/30 text-4xl mb-3" />
              <p className="text-white/50 text-sm">{cameraError}</p>
              <button onClick={() => startCamera(facing)} className="mt-3 text-[#9fc031] text-sm font-medium">
                Reessayer
              </button>
            </div>
          </div>
        )}

        {/* Top controls */}
        <div className="absolute top-14 right-4 flex flex-col gap-3 z-10">
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center">
            <FontAwesomeIcon icon={faXmark} className="text-white text-lg" />
          </button>
          {!captured && (
            <button
              onClick={() => setFlashOn(!flashOn)}
              className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center ${flashOn ? "bg-yellow-400/80" : "bg-black/30"}`}
            >
              <FontAwesomeIcon icon={faBolt} className={`text-sm ${flashOn ? "text-black" : "text-yellow-400"}`} />
            </button>
          )}
        </div>

        {/* Hint text */}
        {!captured && !cameraError && !capturing && (
          <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
            <p className="text-white/50 text-xs font-medium">
              {facing === "environment" ? "Prends ton plat en photo" : "Montre ta tete de foodie"}
            </p>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="bg-black px-6 pt-4 pb-[max(env(safe-area-inset-bottom),2.5rem)]">
        {/* Recipe selector */}
        <div className="flex justify-center gap-2 mb-4">
          {weeklyRecipes.map((r, i) => (
            <button
              key={r.id}
              onClick={() => setSelectedRecipe(i)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 ${
                i === selectedRecipe
                  ? "bg-[#005b52] text-white"
                  : "bg-white/10 text-white/50"
              }`}
            >
              {r.name.split(" ")[0]}
            </button>
          ))}
        </div>

        {captured ? (
          /* Post-capture: caption + publish */
          <div>
            {/* Caption input */}
            <div className="mb-4">
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Ajoute une legende..."
                className="w-full bg-white/10 text-white text-sm rounded-xl px-4 py-3 placeholder-white/30 outline-none focus:ring-2 focus:ring-[#005b52]/50 transition-all"
              />
            </div>

            <div className="flex items-center justify-around">
              <button
                onClick={handleRetake}
                className="text-white text-sm font-medium px-5 py-2.5 rounded-full bg-white/10"
              >
                Reprendre
              </button>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="text-white text-sm font-semibold px-8 py-2.5 rounded-full bg-[#005b52] tap-scale flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                Publier
              </button>
            </div>
          </div>
        ) : (
          /* Camera controls */
          <div className="flex items-center justify-around">
            <button className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <FontAwesomeIcon icon={faImages} className="text-white/60 text-lg" />
            </button>
            <button
              onClick={handleCapture}
              disabled={capturing}
              className={`w-[72px] h-[72px] rounded-full bg-white flex items-center justify-center tap-scale relative ${capturing ? "opacity-50" : ""}`}
            >
              <div className="absolute inset-1 rounded-full border-[3px] border-black/10" />
            </button>
            <button
              onClick={handleFlip}
              disabled={capturing}
              className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faRotate} className="text-white/60 text-lg" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
