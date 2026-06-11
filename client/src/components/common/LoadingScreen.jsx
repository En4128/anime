import { useEffect, useState } from 'react';

const LoadingScreen = ({ onComplete }) => {
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFading(true);
            setTimeout(onComplete, 500); 
        }, 2000); 

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-secondary transition-opacity duration-500 ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
        >
            <div className="relative flex flex-col items-center">
               
                <div className="absolute -inset-8 rounded-full bg-primary/20 blur-xl animate-pulse-slow" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent shadow-glow animate-bounce" />
                    <h1 className="font-display text-4xl font-bold tracking-wider text-white">
                        Xeno<span className="text-primary">Stream</span>
                    </h1>
                </div>

               
                <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-full origin-left animate-[grow_2s_ease-in-out] bg-primary" />
                </div>

                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/40 animate-pulse">
                    opening Anime World....
                </p>
            </div>
        </div>
    );
};

export default LoadingScreen;
