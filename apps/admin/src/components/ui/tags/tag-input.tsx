"use client";

import React from "react";
import { type VariantProps } from "class-variance-authority";
import { nanoid } from "nanoid";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CommandInput } from "@/components/ui/command";
import { Input } from "@/components/ui/input";

import { Autocomplete } from "./auto-complete";
import { tagVariants } from "./tag";
import { TagList } from "./tag-list";

export enum Delimiter {
  Comma = ",",
  Enter = "Enter",
  Space = " ",
}

type OmittedInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "value"
>;

export type Tag = {
  id: string;
  name: string;
};

export interface TagInputProps
  extends OmittedInputProps,
    VariantProps<typeof tagVariants> {
  placeholder?: string;
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  enableAutocomplete?: boolean;
  autocompleteOptions?: Tag[];
  maxTags?: number;
  minTags?: number;
  readOnly?: boolean;
  disabled?: boolean;
  onTagAdd?: (tag: string) => void;
  onTagRemove?: (tag: string) => void;
  allowDuplicates?: boolean;
  validateTag?: (tag: string) => boolean;
  delimiter?: Delimiter;
  showCount?: boolean;
  placeholderWhenFull?: string;
  sortTags?: boolean;
  delimiterList?: string[];
  truncate?: number;
  minLength?: number;
  maxLength?: number;
  usePopoverForTags?: boolean;
  value?: string | number | readonly string[] | { id: string; name: string }[];
  autocompleteFilter?: (option: string) => boolean;
  direction?: "row" | "column";
  onInputChange?: (value: string) => void;
  customTagRenderer?: (tag: Tag) => React.ReactNode;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onTagClick?: (tag: Tag) => void;
  draggable?: boolean;
  inputFieldPostion?: "bottom" | "top" | "inline";
  clearAll?: boolean;
  onClearAll?: () => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>((props) => {
  const {
    id,
    placeholder,
    tags,
    setTags,
    variant,
    size,
    shape,
    className,
    enableAutocomplete,
    autocompleteOptions,
    maxTags,
    delimiter = Delimiter.Comma,
    onTagAdd,
    onTagRemove,
    allowDuplicates,
    showCount,
    validateTag,
    placeholderWhenFull = "Max tags reached",
    sortTags,
    delimiterList,
    truncate,
    autocompleteFilter,
    borderStyle,
    textCase,
    interaction,
    animation,
    textStyle,
    minLength,
    maxLength,
    direction = "row",
    onInputChange,
    customTagRenderer,
    onFocus,
    onBlur,
    onTagClick,
    draggable = false,
    inputFieldPostion = "bottom",
    clearAll = false,
    onClearAll,
    usePopoverForTags = false,
    inputProps = {},
  } = props;

  const [inputValue, setInputValue] = React.useState("");
  const [tagCount, setTagCount] = React.useState(Math.max(0, tags.length));
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [draggedTagId, setDraggedTagId] = React.useState<string | null>(null);

  if (
    (maxTags !== undefined && maxTags < 0) ||
    (props.minTags !== undefined && props.minTags < 0)
  ) {
    console.warn("maxTags and minTags cannot be less than 0");
    toast.error("maxTags and minTags cannot be less than 0");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onInputChange?.(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      delimiterList
        ? delimiterList.includes(e.key)
        : e.key === delimiter || e.key === Delimiter.Enter
    ) {
      e.preventDefault();
      const newTagText = inputValue.trim();

      if (validateTag && !validateTag(newTagText)) {
        return;
      }

      if (minLength && newTagText.length < minLength) {
        console.warn("Tag is too short");
        toast.error("Tag is too short");
        return;
      }

      // Validate maxLength
      if (maxLength && newTagText.length > maxLength) {
        toast.error("Tag is too long");
        console.warn("Tag is too long");
        return;
      }

      const newTagId = nanoid();

      if (
        newTagText &&
        (allowDuplicates || !tags.some((tag) => tag.name === newTagText)) &&
        (maxTags === undefined || tags.length < maxTags)
      ) {
        setTags([...tags, { id: newTagId, name: newTagText }]);
        onTagAdd?.(newTagText);
        setTagCount((prevTagCount) => prevTagCount + 1);
      }
      setInputValue("");
    }
  };

  const removeTag = (idToRemove: string) => {
    setTags(tags.filter((tag) => tag.id !== idToRemove));
    onTagRemove?.(tags.find((tag) => tag.id === idToRemove)?.name || "");
    setTagCount((prevTagCount) => prevTagCount - 1);
  };

  const handleDragStart = (id: string) => {
    setDraggedTagId(id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (id: string) => {
    if (draggedTagId === null) return;

    const draggedTagIndex = tags.findIndex((tag) => tag.id === draggedTagId);
    const dropTargetIndex = tags.findIndex((tag) => tag.id === id);

    if (draggedTagIndex === dropTargetIndex) return;

    const newTags = [...tags];
    const [reorderedTag] = newTags.splice(draggedTagIndex, 1);
    newTags.splice(dropTargetIndex, 0, reorderedTag);

    setTags(newTags);
    setDraggedTagId(null);
  };

  const handleClearAll = () => {
    onClearAll?.();
  };

  const filteredAutocompleteOptions = autocompleteFilter
    ? autocompleteOptions?.filter((option) => autocompleteFilter(option.name))
    : autocompleteOptions;

  const displayedTags = sortTags ? [...tags].sort() : tags;

  const truncatedTags = truncate
    ? tags.map((tag) => ({
        id: tag.id,
        name:
          tag.name?.length > truncate
            ? `${tag.name.substring(0, truncate)}...`
            : tag.name,
      }))
    : displayedTags;

  return (
    <div
      className={`flex w-full gap-3 ${
        inputFieldPostion === "bottom"
          ? "flex-col"
          : inputFieldPostion === "top"
          ? "flex-col-reverse"
          : "flex-row"
      }`}
    >
      {!usePopoverForTags ? (
        <TagList
          tags={truncatedTags}
          customTagRenderer={customTagRenderer}
          variant={variant}
          size={size}
          shape={shape}
          borderStyle={borderStyle}
          textCase={textCase}
          interaction={interaction}
          animation={animation}
          textStyle={textStyle}
          onTagClick={onTagClick}
          draggable={draggable}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          onRemoveTag={removeTag}
          direction={direction}
        />
      ) : null}
      {enableAutocomplete ? (
        <div className="w-full max-w-[450px]">
          <Autocomplete
            tags={tags}
            setTags={setTags}
            autocompleteOptions={filteredAutocompleteOptions as Tag[]}
            maxTags={maxTags}
            onTagAdd={onTagAdd}
            allowDuplicates={allowDuplicates ?? false}
          >
            <CommandInput
              placeholder={
                maxTags !== undefined && tags.length >= maxTags
                  ? placeholderWhenFull
                  : placeholder
              }
              ref={inputRef}
              value={inputValue}
              disabled={maxTags !== undefined && tags.length >= maxTags}
              onChangeCapture={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              onBlur={onBlur}
              className="w-full"
            />
          </Autocomplete>
        </div>
      ) : (
        <div className="w-full">
          <Input
            ref={inputRef}
            id={id}
            type="text"
            placeholder={
              maxTags !== undefined && tags.length >= maxTags
                ? placeholderWhenFull
                : placeholder
            }
            value={inputValue || ""}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            {...inputProps}
            className={className}
            autoComplete={enableAutocomplete ? "on" : "off"}
            list={enableAutocomplete ? "autocomplete-options" : undefined}
            disabled={maxTags !== undefined && tags.length >= maxTags}
          />
        </div>
      )}
      {showCount && maxTags && (
        <div className="flex">
          <span className="text-muted-foreground ml-auto mt-1 text-sm">
            {`${tagCount}`}/{`${maxTags}`}
          </span>
        </div>
      )}
      {clearAll && (
        <Button type="button" onClick={handleClearAll} className="mt-2">
          Clear All
        </Button>
      )}
    </div>
  );
});

TagInput.displayName = "TagInput";

export { TagInput };
