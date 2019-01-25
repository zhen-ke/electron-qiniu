import http from "./http";
import {
  getBucketListUrl,
  deleteBucketUrl,
  createBucketUrl,
  deleteResourceUrl,
  getListUrl,
  getBucketDomainUrl
} from "./api";
import qiniu from "qiniu";

// 获取 Bucket 列表
export const getBucketList = data =>
  http.get(getBucketListUrl, {
    headers: {
      Authorization: qiniu.util.generateAccessToken(data, getBucketListUrl)
    }
  });

// 创建 Bucket
export const createBucket = (mac, name, region) => {
  let url = createBucketUrl + qiniu.util.urlsafeBase64Encode(name) + "/region/" + region;
  return http.post(url, null, {
    headers: {
      Authorization: qiniu.util.generateAccessToken(mac, url)
    }
  });
};

// 删除 Bucket
export const deleteBucket = (mac, data) =>
  http.post(deleteBucketUrl + data, null, {
    headers: {
      Authorization: qiniu.util.generateAccessToken(mac, deleteBucketUrl + data)
    }
  });

// 删除资源
export const deleteResource = (mac, data) => {
  let url = deleteResourceUrl + qiniu.util.urlsafeBase64Encode(data);
  return http.post(url, null, {
    headers: {
      Authorization: qiniu.util.generateAccessToken(mac, url)
    }
  });
};

// 资源列举
export const getList = (mac, data) =>
  http.get(getListUrl, {
    params: {
      bucket: data
    },
    headers: {
      Authorization: qiniu.util.generateAccessToken(
        mac,
        getListUrl + "?bucket=" + data
      )
    }
  });

// 获取 Bucket 空间域名
export const getBucketDomain = (mac, data) =>
  http.get(getBucketDomainUrl, {
    params: {
      tbl: data
    },
    headers: {
      Authorization: qiniu.util.generateAccessToken(
        mac,
        getBucketDomainUrl + "?tbl=" + data
      )
    }
  });
