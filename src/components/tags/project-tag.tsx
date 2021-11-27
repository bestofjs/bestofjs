import React from "react";
import { Link } from "react-router-dom";
import { MdAdd } from "react-icons/md";

import { Button, Wrap, WrapItem, useColorMode } from "components/core";
import { useNextLocation } from "../search";

type Props = {
  tags: BestOfJS.Tag[];
  appendTag?: boolean;
};
export const ProjectTagGroup = ({ tags, ...otherProps }: Props) => {
  return (
    <Wrap>
      {tags.map((tag) => (
        <WrapItem key={tag.code}>
          <ProjectTag tag={tag} {...otherProps} />
        </WrapItem>
      ))}
    </Wrap>
  );
};

export const ProjectTag = ({
  tag,
  appendTag,
}: {
  tag: BestOfJS.Tag;
  appendTag?: boolean;
}) => {
  const { colorMode } = useColorMode();
  const { updateLocation } = useNextLocation();
  const nextLocation = updateLocation((state) => ({
    ...state,
    selectedTags: appendTag ? [...state.selectedTags, tag.code] : [tag.code],
    query: "",
  }));

  return (
    <Button
      as={Link}
      to={{ ...nextLocation, pathname: "/projects" }}
      variant={colorMode === "dark" ? "solid" : "outline"}
      size="sm"
      fontSize="0.875rem"
      rightIcon={appendTag ? <MdAdd /> : undefined}
    >
      {tag.name}
    </Button>
  );
};
