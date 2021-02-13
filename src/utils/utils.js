const auth = require("solid-auth-client");
const FC = require("solid-file-client");
const fc = new FC(auth);

export const getFileStructure = async (url) => {
  try {
    if (await fc.itemExists(url)) {
      const folderData = await fc.readFolder(url, {
        links: FC.LINKS.EXCLUDE,
      });
      return folderData;
    }
  } catch (error) {
    console.error(error);
  }

  return null;
};

export const getFoldersForUrl = async (url) => {
  const fileStructure = await getFileStructure(url);

  const treeNode = {
    type: "folder",
    access: "public",
    url,
    children: [
      ...(await Promise.all(
        fileStructure?.folders.map((folder) => getFoldersForUrl(folder.url))
      )),
      ...fileStructure?.files.map((file) => ({
        type: "file",
        access: "public",
        url: file.url,
      })),
    ],
  };
  return treeNode;
};

