---
description: webrtc-signaling-server
---

# Error code

{% hint style="info" %}
uses 9000 lines.
{% endhint %}

### 9000\* <a id="9000"></a>

> basic

| 에러코드 | 내용 | 확인 |
| :--- | :--- | :--- |
| 9000 | json parse error | check your message if you message exactly. |
| 9001 | message error | check your message if you add property exactly. |
| 9002 | message cmd error | check your message if you add cmd property exactly. |

### 9100\* <a id="9100"></a>

> about client

| 에러코드 | 내용 | 확인사항 |
| :--- | :--- | :--- |
| 9100 | send your id first. | check your code if you sent id or not. |
| 9101 | id already registered. | check your code if you create client more than one. |
| 9102 | id already existed. | check your id. |

### 9200\* <a id="9200"></a>

> about session

| 에러코드 | 내용 | 확인사항 |
| :--- | :--- | :--- |
| 9200 | can not create by yourself. | check your code if you create session by yourself. |
| 9201 | opponent not found. | check opponent if existed or not. |
| 9202 | on calling state. | check if call is ended or not. |
| 9203 | opponent on calling state. | check opponent if call is ended or not. |
| 9204 | session not found. | check your session id if correct or not. |

### 9300\* <a id="9300"></a>

> about notification

| 에러코드 | 내용 | 확인사항 |
| :--- | :--- | :--- |
| 9300 | can not notify by yourself. | check your code if you send by yourself. |
| 9301 | opponent not found. | check opponent if existed or not. |
| ​ | ​ | ​ |

### 9400\* <a id="9400"></a>

> about socket

| 에러코드 | 내용 | 확인사항 |
| :--- | :--- | :--- |
| 9400 | socket send fail. | check your internet if connected or not. |
| 9401 | socket is not opened. | check your internet if connected or not. |
| 9402 | socket is not existed. | check your internet if connected or not. |

