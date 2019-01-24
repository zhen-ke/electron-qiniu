import http from "./http";
import { bucketsUrl, dropUrl, addUrl } from "./api";
import qiniu from "qiniu";

// 获取存储空间
export const storageList = data =>
  http.get(bucketsUrl, {
    headers: {
      Authorization: qiniu.util.generateAccessToken(data, bucketsUrl)
    }
  });

// 添加存储空间
export const addBucket = (mac, name, region) => {
  let url = addUrl + qiniu.util.urlsafeBase64Encode(name) + "/region/" + region;
  return http.post(url, null, {
    headers: {
      Authorization: qiniu.util.generateAccessToken(mac, url)
    }
  });
};

// 删除存储空间
export const dropStorage = (mac, data) =>
  http.post(dropUrl + data, null, {
    headers: {
      Authorization: qiniu.util.generateAccessToken(mac, dropUrl + data)
    }
  });
