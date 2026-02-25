import { useSignal } from "@preact/signals";
import { useEffect, useState } from "react";
import SpinnerComponent from "../internal/spinner/spinner.component";

export default function AppInit({ children }: { children: React.ReactNode }) {
    const [loading, setLoading]= useState<boolean>(true);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://kit.fontawesome.com/${import.meta.env.VITE_APP_FONT_AWESOME}.js`;
        script.crossOrigin = "anonymous";

        script.onload = () => {
            setLoading(false);
        };

        document.head.appendChild(script);
    }, []);

    return loading? <SpinnerComponent /> : children;
}