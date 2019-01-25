import http from "./http";
import { bucketsUrl, dropUrl, addUrl, deleteUrl, listUrl } from "./api";
import qiniu from "qiniu";

// 获取 Bucket 列表
export const storageList = data =>
  http.get(bucketsUrl, {
    headers: {
      Authorization: qiniu.util.generateAccessToken(data, bucketsUrl)
    }
  });

// 创建 Bucket
export const addBucket = (mac, name, region) => {
  let url = addUrl + qiniu.util.urlsafeBase64Encode(name) + "/region/" + region;
  return http.post(url, null, {
    headers: {
      Authorization: qiniu.util.generateAccessToken(mac, url)
    }
  });
};

// 删除 Bucket
export const dropStorage = (mac, data) =>
  http.post(dropUrl + data, null, {
    headers: {
      Authorization: qiniu.util.generateAccessToken(mac, dropUrl + data)
    }
  });

// 删除资源
export const deleteImg = (mac, data) => {
  let url = deleteUrl + data;
  return http.post(url, null, {
    headers: {
      Authorization: qiniu.util.generateAccessToken(mac, url)
    }
  });
};

// 资源列举
export const getList = (mac, data) =>
  http.get(listUrl, {
    params: {
      bucket: data
    },
    headers: {
      Authorization: qiniu.util.generateAccessToken(
        mac,
        listUrl + "?bucket=" + data
      )
    }
  });
