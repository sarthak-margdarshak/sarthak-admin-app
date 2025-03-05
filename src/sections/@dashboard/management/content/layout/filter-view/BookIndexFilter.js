import {
  Alert,
  IconButton,
  MenuItem,
  MenuList,
  Skeleton,
  TextField,
} from "@mui/material";
import { Fragment, useState } from "react";
import IndexView from "sections/@dashboard/management/content/question/component/IndexView";
import { Query } from "appwrite";
import { appwriteDatabases } from "auth/AppwriteContext";
import { APPWRITE_API } from "config-global";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import { LoadingButton } from "@mui/lab";

export default function BookIndexFilter({ onChange }) {
  const [isIndexLoading, setIsIndexLoading] = useState(false);
  const [indexList, setIndexList] = useState([]);
  const [inEditMode, setInEditMode] = useState(false);
  const [currValue, setCurrValue] = useState({
    id: null,
    label: "Click Edit to Select Index",
  });
  const [loading, setLoading] = useState(false);
  const [currInputValue, setCurrInputValue] = useState("");

  const onIndexValueChange = async () => {
    let orQueries = [];
    if (
      currInputValue !== "" &&
      currInputValue !== null &&
      currInputValue !== undefined
    ) {
      orQueries = [
        Query.contains("standard", currInputValue),
        Query.contains("subject", currInputValue),
        Query.contains("chapter", currInputValue),
        Query.contains("concept", currInputValue),
      ];
    }
    let queries = [Query.limit(100), Query.select("$id")];
    if (orQueries.length > 0) {
      queries.push(Query.or(orQueries));
    }
    setIsIndexLoading(true);
    try {
      const tem = (
        await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.bookIndex,
          queries
        )
      ).documents.map((doc) => doc.$id);
      const data = (
        await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.bookIndex,
          [
            Query.or([
              Query.contains("standard", tem),
              Query.contains("subject", tem),
              Query.contains("chapter", tem),
              Query.contains("concept", tem),
              Query.equal("$id", tem),
            ]),
          ]
        )
      ).documents.map((doc) => doc.$id);
      setIndexList(data);
    } catch (error) {
      console.log(error);
    }
    setIsIndexLoading(false);
  };

  if (inEditMode) {
    return (
      <Fragment>
        <TextField
          fullWidth
          sx={{ mt: 2 }}
          value={currInputValue}
          onChange={(event) => {
            setCurrInputValue(event.target.value);
          }}
          onKeyDown={async (event) => {
            if (event.code === "Enter") {
              await onIndexValueChange();
            }
          }}
          label="Select Index"
        />

        {isIndexLoading ? (
          <LoadingButton
            sx={{ mt: 2 }}
            variant="contained"
            loading={isIndexLoading}
          >
            Loading
          </LoadingButton>
        ) : (
          <MenuList open={inEditMode} sx={{ zIndex: 5 }}>
            {indexList.map((option, index) => (
              <MenuItem
                key={index}
                value={option}
                onClick={async (event) => {
                  setLoading(true);
                  setInEditMode(false);
                  setCurrValue({
                    id: option,
                    label: event.target["textContent"],
                  });
                  setLoading(false);
                  onChange(option);
                }}
              >
                <IndexView id={option} />
              </MenuItem>
            ))}
          </MenuList>
        )}
      </Fragment>
    );
  } else {
    return (
      <Alert
        sx={{ mt: 2 }}
        severity={currValue.id ? "success" : "warning"}
        variant="outlined"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setInEditMode(true);
            }}
          >
            <BorderColorRoundedIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {loading ? <Skeleton width={300} /> : currValue.label}
      </Alert>
    );
  }
}
