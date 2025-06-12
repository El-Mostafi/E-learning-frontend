"use client";
import { useState, useCallback, useRef, FC, useEffect } from "react";
import { useClickAway } from "react-use";

export interface Option {
  value: string;
  text: string;
}

type NiceSelectProps = {
  options: Option[];
  defaultCurrent: number;
  placeholder: string;
  className?: string;
  onChange: (item: Option, name: string) => void;
  name: string;
  value?: string;
};

const NiceSelect: FC<NiceSelectProps> = ({
  options,
  defaultCurrent,
  placeholder,
  className,
  onChange,
  name,
  value,
}) => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Option>(options[defaultCurrent]);
  const onClose = useCallback(() => {
    setOpen(false);
  }, []);
  const ref = useRef<HTMLDivElement | null>(null);

  useClickAway(ref, onClose);
  useEffect(() => {
    if (value) {
      const matched = options.find((opt) => opt.value === value);
      if (matched && matched.value !== current.value) {
        setCurrent(matched);
      }
    }
  }, [value, options]);

  const currentHandler = (item: Option) => {
    setCurrent(item);
    onChange(item, name);
    onClose();
  };

  return (
    <div
      className={`nice-select form-select-lg ${className || ""} ${
        open ? "open" : ""
      }`}
      role="button"
      tabIndex={0}
      onClick={() => setOpen((prev) => !prev)}
      onKeyDown={(e) => e}
      ref={ref}
    >
      <span className="current">{current?.text || placeholder}</span>
      <ul
        className="list"
        role="menubar"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {options?.map((item, i) => (
          <li
            key={i}
            data-value={item.value}
            className={`option ${
              item.value === current?.value ? "selected focus" : ""
            }`}
            style={{ fontSize: "14px" }}
            role="menuitem"
            onClick={() => currentHandler(item)}
            onKeyDown={(e) => e}
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NiceSelect;
