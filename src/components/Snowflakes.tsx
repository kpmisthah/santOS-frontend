
import { useEffect, useState } from 'react';

interface Snowflake {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
    sway: number;
}

const Snowflakes = () => {
    const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

    useEffect(() => {
        // Create initial batch of snowflakes
        const initialSnowflakes = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // vw
            y: Math.random() * 100, // vh
            size: Math.random() * 3 + 1, // px
            opacity: Math.random() * 0.5 + 0.3,
            speed: Math.random() * 1 + 0.5,
            sway: Math.random() * 20 - 10,
        }));
        setSnowflakes(initialSnowflakes);

        // Animation loop
        const interval = setInterval(() => {
            setSnowflakes(prev => prev.map(flake => {
                let newY = flake.y + flake.speed * 0.2;
                let newX = flake.x + Math.sin(newY * 0.1) * 0.1;

                // Reset individual flake when it goes off screen
                if (newY > 100) {
                    newY = -5;
                    newX = Math.random() * 100;
                }

                return {
                    ...flake,
                    y: newY,
                    x: newX
                };
            }));
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="absolute bg-white rounded-full blur-[0.5px]"
                    style={{
                        left: `${flake.x}%`,
                        top: `${flake.y}%`,
                        width: `${flake.size}px`,
                        height: `${flake.size}px`,
                        opacity: flake.opacity,
                        transform: `translateX(${Math.sin(flake.y * 0.1) * flake.sway}px)`,
                        transition: 'top 0.05s linear'
                    }}
                />
            ))}
        </div>
    );
};

export default Snowflakes;
