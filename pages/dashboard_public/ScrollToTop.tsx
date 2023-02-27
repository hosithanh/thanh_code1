import React, { useEffect, useState } from 'react';

function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 50) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);
    return (
        <div >
            {isVisible && (
                <div className="scroll-to-top" onClick={scrollToTop}>
                    <i className="fa fa-angle-double-up" />
                </div>
            )}
        </div>
    )
}

export default ScrollToTop