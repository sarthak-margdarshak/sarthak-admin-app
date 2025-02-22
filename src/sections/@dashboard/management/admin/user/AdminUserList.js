import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import { appwriteDatabases } from "auth/AppwriteContext";
import { APPWRITE_API } from "config-global";
import { Query } from "appwrite";

export default function AdminUserList({ onChange }) {
  const [isUserListLoading, setIsUserListLoading] = useState(false);
  const [userList] = useState([]);

  return (
    <Autocomplete
      fullWidth
      autoComplete
      loading={isUserListLoading}
      options={userList}
      onFocus={async (event, value) => {
        setIsUserListLoading(true);
        try {
          // const tem = await User.getUserList(value);
          // setUserList(tem);
        } catch (error) {
          console.log(error);
        }
        setIsUserListLoading(false);
      }}
      onInputChange={async (event, value) => {
        setIsUserListLoading(true);
        try {
          // const tem = await User.getUserList(value);
          // setUserList(tem);
        } catch (error) {
          console.log(error);
        }
        setIsUserListLoading(false);
      }}
      onChange={async (event, value) => {
        const id = (
          await appwriteDatabases.listDocuments(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.adminUsers,
            [
              Query.select("$id"),
              Query.equal("empId", value.match(/\w{3}\d{4}/g)),
            ]
          )
        ).documents[0].$id;
        onChange(id);
      }}
      renderOption={(props, option) => (
        <li {...props} key={props.key}>
          {option}
        </li>
      )}
      renderInput={(params) => <TextField {...params} label="Users" />}
      sx={{ mt: 2 }}
    />
  );
}
