import React, { useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import "./SelectionOverlay.css";
import "primeicons/primeicons.css";

interface SelectionOverlayProps {
    onSelectCount: (count: number) => void;
    totalRecords: number;
}

const SelectionOverlay: React.FC<SelectionOverlayProps> = ({
    onSelectCount,
    totalRecords,
}) => {
    const op = useRef<OverlayPanel>(null);
    const [inputValue, setInputValue] = useState<string>("");

    const handleSubmit = () => {
        const count = parseInt(inputValue);
        if (!isNaN(count) && count > 0) {
            onSelectCount(Math.min(count, totalRecords));
            op.current?.hide();
            setInputValue("");
        }
    };

    return (
        <div className="selection-overlay">
            <div>

            <OverlayPanel ref={op}>
                <div className="overlay-panel">
                    <div className="overlay-p">
                        <div className="overlay-text">
                            <label className="overlay-label">Select multiple rows</label>
                            <p>Enter number of rows to select across all pages</p>
                        </div>
                        <div className="overlay-select">
                            <input
                                type="number"
                                className="overlay-input"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="e.g., 20"
                                min={1}
                                max={totalRecords}
                                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            />
                            <button className="overlay-submit-btn" onClick={handleSubmit}>
                                Select
                            </button>
                        </div>
                    </div>
                </div>
            </OverlayPanel>
                                </div>

                                <div>

<button
    type="button"
    
    className="chevron-btn"
    onClick={(e) => op.current?.toggle(e)}
    aria-label="Custom row selection"
>
    <i className="pi pi-chevron-down"></i>
</button>
    </div>

        </div>
    );
};

export default SelectionOverlay;