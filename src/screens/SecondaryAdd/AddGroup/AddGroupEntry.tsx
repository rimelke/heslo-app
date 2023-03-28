import Button from "@components/Button";
import HiddenInput from "@components/form/HiddenInput";
import Input from "@components/form/Input";
import Upload from "@components/form/Upload";
import { Scope } from "@unform/core";
import { useState } from "react";
import { View } from "react-native";
import { DocumentIcon, LockClosedIcon } from "react-native-heroicons/solid";
import theme from "src/theme";
import { EntryType } from "src/types/IEntry";

interface AddGroupEntryProps {
  index: number;
}

const AddGroupEntry = ({ index }: AddGroupEntryProps) => {
  const [selectedType, setSelectedType] = useState<EntryType>("text");

  return (
    <Scope path={`entries[${index}]`}>
      <HiddenInput name="type" value={selectedType} />

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
        }}
      >
        <Button
          onPress={() => setSelectedType("text")}
          style={{ marginRight: 4, paddingHorizontal: 12, marginTop: 28 }}
          colorScheme={selectedType === "text" ? "flame" : "floral-dark"}
        >
          <LockClosedIcon size={20} color={theme.colors.floral.DEFAULT} />
        </Button>
        <Button
          onPress={() => setSelectedType("file")}
          style={{ marginLeft: 4, paddingHorizontal: 12, marginTop: 28 }}
          colorScheme={selectedType === "file" ? "flame" : "floral-dark"}
        >
          <DocumentIcon size={20} color={theme.colors.floral.DEFAULT} />
        </Button>
        <Input
          name="title"
          label="Title"
          style={{
            marginLeft: 12,
            flex: 1,
          }}
        />
      </View>

      <View
        style={{
          marginTop: 8,
          marginBottom: 16,
        }}
      >
        {selectedType === "text" ? (
          <Input name="content" label="Content" multiline />
        ) : (
          <Upload name="file" isInlined />
        )}
      </View>
    </Scope>
  );
};

export default AddGroupEntry;
