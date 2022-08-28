import axios from "axios"
import {
  getIpfsMetaData as pinataIpfsGetIpfsMetadata,
  uploadFile as pinataIpfsUploadFile,
  downloadJson
} from "@debionetwork/pinata-ipfs"

const pinataJwtKey = process.env.REACT_APP_PINATA_JWT_KEY

export const uploadFile = val => {
  const options = {
    pinataMetadata: {
      name: val.title,
      keyvalues: {
        required: process.env.REACT_APP_PINATA_REQUIRED_DOCUMENT,
        type: val.type,
        fileSize: val.size,
        date: +new Date()
      }
    },
    pinataOptions: { cidVersion: 0 }
  }

  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  return pinataIpfsUploadFile(
    options,
    val.file,
    pinataJwtKey,
    source.token,
    (progressEvent) => {
      if (!progressEvent.lengthComputable) return

      // eslint-disable-next-line
      let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total )
    }
  )
}

export const getFileUrl = cid => {
  return `${process.env.REACT_APP_PINATA_GATEWAY}/${cid}`
}

export const downloadFile = async (ipfsLink, withMetaData = false) => {
  console.log("Downloading...")

  // TODO : ADD DOWNLOAD PROGRESS
  
  const result = await downloadJson(
    ipfsLink,
    withMetaData,
    pinataJwtKey
  )
  console.log("Success Downloaded!")

  return result
}

export const getIpfsMetaData = async (cid) => {
  return await pinataIpfsGetIpfsMetadata(
    cid,
    pinataJwtKey
  )
}

export const downloadDocumentFile = (data, fileName, type) => {
  try {
    const blob = new Blob([data], { type });
    const a = document.createElement("a");

    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
    a.click()
  } catch (error) {
    console.error(error)
  }
}
