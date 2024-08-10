// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   Image,
// } from "react-native";
// import * as DocumentPicker from "expo-document-picker";
// import * as ImagePicker from "expo-image-picker";
// import { Ionicons } from "@expo/vector-icons";
// import axiosInstance from "@/app/utils/axiosInstance";
// import { useUser } from "@/app/context/UserProvider";
// import { BACKEND_BASE_URL } from "@/config/config";

// interface FileUploadProps {
//   onUploadSuccess?: (url: string) => void;
// }

// const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
//   const [uploading, setUploading] = useState(false);
//   const [file, setFile] = useState<any>(null);
//   const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
//   const { user } = useUser();

//   const handleFilePick = async () => {
//     try {
//       const res = await DocumentPicker.getDocumentAsync({
//         type: "image/*",
//       });
//       if (res.type === "cancel") {
//         Alert.alert("Canceled", "File selection was canceled.");
//         return;
//       }
//       setFile(res);
//       handleUpload(res); // Start upload immediately after file selection
//     } catch (err) {
//       Alert.alert("Error", "An error occurred while selecting the file.");
//     }
//   };

//   const handleCameraPick = async () => {
//     const { status } = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Permission Denied", "Camera access is required to capture images.");
//       return;
//     }

//     try {
//       const result = await ImagePicker.launchCameraAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         quality: 1,
//       });

//       if (!result.canceled) {
//         const { uri, type } = result.assets[0];
//         setFile({ uri, mimeType: type, name: uri.split("/").pop() });
//         handleUpload({ uri, mimeType: type, name: uri.split("/").pop() });
//       }
//     } catch (err) {
//       Alert.alert("Error", "An error occurred while capturing the image.");
//     }
//   };

//   const handleUpload = async (file: any) => {
//     if (!file) {
//       Alert.alert("No File", "Please select or capture a file to upload.");
//       return;
//     }

//     setUploading(true);
//     const formData = new FormData();
//     formData.append("file", {
//       uri: file.uri,
//       type: file.mimeType || "application/octet-stream",
//       name: file.name,
//     });
//     formData.append("folder", "uploads");

//     try {
//       const url = `${BACKEND_BASE_URL}/upload`;
//       const response = await axiosInstance.post(url, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       const uploadedUrl = response.data.url;
//       setUploadedUrl(uploadedUrl);
//       if (onUploadSuccess) {
//         onUploadSuccess(uploadedUrl);
//       }
//     } catch (error) {
//       Alert.alert("Upload Error", "Failed to upload the file.");
//       console.error("Failed to upload file:", error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleRemoveFile = () => {
//     setFile(null);
//     setUploadedUrl(null);
//   };

//   return (
//     <View className="p-4 items-center">
//       {uploadedUrl ? (
//         <View>
//           <Image
//             source={{ uri: uploadedUrl }}
//             style={{ width: 100, height: 100, marginBottom: 10 }}
//           />
//           <TouchableOpacity
//             onPress={handleRemoveFile}
//             className="absolute top-0 right-0"
//           >
//             <Ionicons name="close-circle" size={24} color="red" />
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <View className="flex-row">
//           <TouchableOpacity
//             onPress={handleFilePick}
//             disabled={uploading}
//             className="w-20 h-20 border border-dashed border-gray-400 justify-center items-center rounded-lg mx-2"
//           >
//             {uploading ? (
//               <ActivityIndicator size="small" color="#000" />
//             ) : (
//               <Ionicons name="add" size={32} color="gray" />
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={handleCameraPick}
//             disabled={uploading}
//             className="w-20 h-20 border border-dashed border-gray-400 justify-center items-center rounded-lg mx-2"
//           >
//             {uploading ? (
//               <ActivityIndicator size="small" color="#000" />
//             ) : (
//               <Ionicons name="camera" size={32} color="gray" />
//             )}
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// export default FileUpload;

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import axiosInstance from "@/app/utils/axiosInstance";
import { useUser } from "@/app/context/UserProvider";
import { BACKEND_BASE_URL } from "@/config/config";
import { truncateFileName } from "@/app/utils/common.utils";

interface FileUploadProps {
  onUploadSuccess?: (url: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<any>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const { user } = useUser();

  const handleFilePick = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "image/*",
      });
      if (res.type === "cancel") {
        Alert.alert("Canceled", "File selection was canceled.");
        return;
      }
      setFile(res);
      handleUpload(res); // Start upload immediately after file selection
    } catch (err) {
      Alert.alert("Error", "An error occurred while selecting the file.");
    }
  };

  const handleCameraPick = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Camera access is required to capture images."
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setFile(file);
        handleUpload(result);
        // const { uri, type } = result.assets[0];
        // setFile({ uri, mimeType: type, name: uri.split("/").pop() });
        // handleUpload({ uri, mimeType: type, name: uri.split("/").pop() });
      }
    } catch (err) {
      Alert.alert("Error", "An error occurred while capturing the image.");
    }
  };

  const handleUpload = async (file: any) => {
    if (!file) {
      Alert.alert("No File", "Please select or capture a file to upload.");
      return;
    }

    let fileData = {};
    if (file?.uri) {
      fileData = file;
    } else {
      fileData = file.assets?.[0];
    }
    console.log("file", fileData);

    setUploading(true);
    const formData = new FormData();
    formData.append("file", {
      uri: fileData.uri,
      type: fileData.mimeType || "application/octet-stream",
      name: truncateFileName(fileData.name || fileData.fileName),
    });
    formData.append("folder", "uploads");

    console.log("====================================");
    console.log("form data", formData);
    console.log("====================================");

    try {
      const url = `${BACKEND_BASE_URL}/upload`;
      const response = await axiosInstance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const uploadedUrl = response.data.url;
      setUploadedUrl(uploadedUrl);
      if (onUploadSuccess) {
        onUploadSuccess(uploadedUrl);
      }
    } catch (error) {
      Alert.alert("Upload Error", "Failed to upload the file.");
      console.error("Failed to upload file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadedUrl(null);
  };

  return (
    <View className="p-4 items-center">
      {uploadedUrl ? (
        <View>
          <Image
            source={{ uri: uploadedUrl }}
            style={{ width: 100, height: 100, marginBottom: 10 }}
          />
          <TouchableOpacity
            onPress={handleRemoveFile}
            className="absolute top-0 right-0"
          >
            <Ionicons name="close-circle" size={24} color="red" />
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row">
          <TouchableOpacity
            onPress={handleFilePick}
            disabled={uploading}
            className="w-20 h-20 border border-dashed border-gray-400 justify-center items-center rounded-lg mx-2"
          >
            {uploading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Ionicons name="add" size={32} color="gray" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCameraPick}
            disabled={uploading}
            className="w-20 h-20 border border-dashed border-gray-400 justify-center items-center rounded-lg mx-2"
          >
            {uploading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Ionicons name="camera" size={32} color="gray" />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default FileUpload;
