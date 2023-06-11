import { useContext } from 'react';
//
import { AuthContext } from './AppwriteContext';

import { Client } from "appwrite";
import { APPWRITE_API } from '../config-global';

const client = new Client();

client
  .setEndpoint(APPWRITE_API.backendUrl) // Your API Endpoint
  .setProject(APPWRITE_API.projectId) // Your project ID
  ;

// ----------------------------------------------------------------------

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuthContext context must be use inside AuthProvider');

  return context;
};
