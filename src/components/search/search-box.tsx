import React, { useState, useEffect, useRef } from "react";
import Select, { components } from "react-select";
import useDebouncedCallback from "use-debounce/lib/useDebouncedCallback";

import {
  Box,
  CloseButton,
  IconButton,
  Tag,
  TagCloseButton,
  TagLabel,
  useColorModeValue,
} from "components/core";
import { useSelector } from "containers/project-data-container";
import { getAllTags } from "selectors";
import { ChevronDownIcon } from "components/core/icons";
import { SearchContainer } from "./search-container";

// see https://github.com/JedWatson/react-select/issues/3692 for theming and dark theme

export const SearchBox = () => {
  const tags: BestOfJS.Tag[] = useSelector(getAllTags);
  const { query, selectedTags, onChange } = SearchContainer.useContainer();
  const [inputValue, setInputValue] = useState(query);
  const [debouncedOnChange, cancel] = useDebouncedCallback(onChange, 300);

  const options = [
    { value: "", label: "", counter: tags.length },
    ...tags.map((item) => ({
      ...item,
      value: item.code,
      label: item.name,
    })),
  ];

  const selectedOptions = selectedTags.map((tagCode) =>
    options.find(({ value }) => value === tagCode)
  );

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const selectRef = useRef<any>();

  return (
    <Box
      bgGradient={useColorModeValue(
        "linear(to-r, orange.400, orange.600)",
        "linear(to-r, orange.500, orange.800)"
      )}
      py={4}
      fontFamily="var(--buttonFontFamily)"
    >
      <div className="container">
        <Select
          ref={selectRef}
          options={options}
          isMulti
          isClearable
          noOptionsMessage={() => null}
          placeholder={"Pick tags or enter keywords"}
          onChange={(options, { action, option }) => {
            const tagCodes = (options || []).map(({ code }) => code);
            if (action === "select-option") {
              if (option.value === "") return;
            }
            setInputValue("");
            cancel();
            onChange({ query: "", selectedTags: tagCodes });
          }}
          onInputChange={(value, { action }) => {
            if (action === "input-change") {
              setInputValue(value);
              debouncedOnChange({ query: value });
            }
          }}
          // This `onKeyDown` event handler is used only for 2 specific cases:
          // - Closing the keyboard on mobiles when the user pushes Enter
          // -  When the user enters text, moves the cursor just after the tag and pushes the Backspace key
          onKeyDown={(event) => {
            const input = selectRef?.current?.select.inputRef;
            if (event.key === "Enter") {
              input.blur();
              return;
            }
            if (event.key !== "Backspace") return;
            if (selectedTags.length === 0) return;
            if (query === "") return;
            const { selectionStart, selectionEnd } = input;
            if (!(selectionStart === 0 && selectionEnd === 0)) return;
            onChange({
              query,
              selectedTags: selectedTags.slice(0, selectedTags.length - 1),
            });
          }}
          inputValue={inputValue}
          value={selectedOptions}
          components={customComponents}
          aria-label="Search by tag or keyword"
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              neutral0: "var(--cardBackgroundColor)",
              neutral20: "var(--boxBorderColor)",
              neutral30: "var(--boxBorderColor)",
              neutral50: "var(--textSecondaryColor)", // placeholder color
              neutral80: "var(--textPrimaryColor)", // input color
              primary: "var(--bestofjsOrange)",
              primary75: "var(--menuHoverColor)",
              primary50: "var(--menuHoverColor)",
              primary25: "var(--menuHoverColor)",
            },
          })}
        />
      </div>
    </Box>
  );
};

// Customize the default `Option` component provided by `react-select`
const { Option, IndicatorsContainer } = components;

const customComponents = {
  ClearIndicator: (props) => {
    return <CloseButton size="sm" mx={2} onClick={() => props.clearValue()} />;
  },
  DropdownIndicator: (props) => {
    return (
      <IconButton
        icon={<ChevronDownIcon fontSize="16px" />}
        aria-label="View tags"
        variant="ghost"
        mx={2}
        size="sm"
        borderRadius="md"
        boxSize="24px"
      />
    );
  },
  Option: (props) => {
    const { value, name, counter } = props.data;
    return (
      <Option {...props}>
        {value ? (
          <>
            {name} <span className="text-secondary">({counter})</span>
          </>
        ) : (
          <>
            Pick a tag...{"  "}
            <span className="text-secondary">({counter} tags available)</span>
          </>
        )}
      </Option>
    );
  },
  IndicatorsContainer: ({ children, ...props }) => {
    const { hasValue } = props; // the selected tags
    const { inputValue } = props.selectProps; // the query
    return (
      <IndicatorsContainer {...props}>
        {inputValue && !hasValue && (
          <CloseButton onClick={() => props.clearValue()} size="sm" mr={2} />
        )}
        {children}
      </IndicatorsContainer>
    );
  },
  MultiValue: (props) => {
    const {
      data: { label },
      removeProps,
    } = props;
    return (
      <Tag mr={2}>
        <TagLabel>{label}</TagLabel>
        <TagCloseButton {...removeProps} />
      </Tag>
    );
  },
};
