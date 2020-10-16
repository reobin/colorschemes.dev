import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

import { SECTIONS, LAYOUTS } from "src/constants";

import { useKeyboardShortcuts } from "src/hooks/useKeyboardShortcuts";

import { Enter, Slash } from "src/components/icons";

import "./index.scss";

const SEARCH_LABELS = {
  DEFAULT: {
    description: "Search. Press / to focus.",
    render: () => <Slash className="search__icon search__icon--short" />,
  },
  FOCUSED: {
    description: "Press Enter to focus out.",
    render: () => <Enter className="search__icon" />,
  },
};

const SearchInput = ({ value, onChange }) => {
  const [label, setLabel] = useState(SEARCH_LABELS.DEFAULT);

  const searchInputWrapperRef = useRef();
  const searchInputRef = useRef();

  useKeyboardShortcuts({
    "/": event => {
      event.preventDefault();
      searchInputRef.current.focus();
    },
    u: () => onChange(""),
  });

  return (
    <label
      ref={searchInputWrapperRef}
      className="search"
      data-section={SECTIONS.ACTIONS}
      data-layout={LAYOUTS.LIST}
      tabIndex="0"
      onKeyDown={event => {
        if (event.target !== searchInputWrapperRef.current) return;
        if (event.key === "Enter") {
          searchInputRef.current.focus();
        }
      }}
    >
      <input
        type="text"
        ref={searchInputRef}
        className="search__input"
        id="search-input"
        name="search-input"
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder="dark, contrast, ..."
        aria-label={label.description}
        onFocus={() => setLabel(SEARCH_LABELS.FOCUSED)}
        onBlur={() => setLabel(SEARCH_LABELS.DEFAULT)}
        onKeyDown={event => {
          if (["Enter", "Escape"].includes(event.key))
            searchInputWrapperRef.current.focus();
        }}
      />
      <span className="search__icon-wrapper" aria-hidden>
        {label.render()}
      </span>
    </label>
  );
};

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SearchInput;
