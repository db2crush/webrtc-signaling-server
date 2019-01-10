---
description: webrtc-signaling-server
---

# Message Category

## sId

reserved word that the client needs to create an id on the server. This is a necessary step for signaling communication.

```javascript
Message = {
    cmd: 'sId',
    sId: String
}
```

{% hint style="info" %}
 sId type is String.
{% endhint %}

## Session

reserved word that the client needs to create a session on the server. This is a necessary step for communication 'call' request. 

```javascript
Message = {
    cmd: 'session',
    opponentId: String
}
```

{% hint style="info" %}
**opponentId** represents the **sId** of the other to communicate with.
{% endhint %}

## Call

reserved word that is required when the client makes a communication call request to the server.

```javascript
Message = {
    cmd: 'call',
    offer: Object,
    sessionId, String
}
```

{% hint style="info" %}
**offer** represents the **sdp** obtained using webrtc client API. **sessionId** indicates the id of created session.
{% endhint %}

## Accept

reserved word that is required when the client makes a communication accept request to the server.

```javascript
Message = {
    cmd: 'accept',
    answer: Object,
    sessionId: String
}
```

{% hint style="info" %}
**answer** represents the **sdp** obtained using webrtc client API. **sessionId** indicates the id that was received.
{% endhint %}

## Reject

reserved word that is required when the client makes a communication denial request to the server.

```javascript
Message = {
    cmd: 'reject',
    sessionId: String
}
```

{% hint style="info" %}
**sessionId** indicates the id that was received.
{% endhint %}

## Stop

reserved word that is required when the client makes a communication stop request to the server.

```javascript
Message = {
    cmd: 'stop',
    sessionId: String
}
```

{% hint style="info" %}
**sessionId** indicates the id of the created or received.
{% endhint %}

## Leave

reserved word that the server unilaterally sends to the client. Occurs when two clients are communicating and one client is disconnected due to various problems, \(e.g. network outage\) the other party receives this .

```javascript
Message = {
    cmd: 'leave',
    sessionId: String
}
```

{% hint style="info" %}
**sessionId** indicates the id of the created or received.
{% endhint %}

## Icecandidate

reserved word that is required when a client sends an candidate returned from a turn server to the server.

```javascript
Message = {
    cmd: 'icecandidate',
    icecandidate: Object
    sessionId: String
}
```

{% hint style="info" %}
**icecandidate** indicates candidate returned from a turn server**. sessionId** indicates the id of the created or received.
{% endhint %}

## Clu \(client list update\)

reserved word that server sends unilaterally to the client. Occurs when the client list is updated.

```javascript
Message = {
    cmd: 'clu',
    list: Array
}
```

{% hint style="info" %}
**list** indicates an array of objects containing the client's **sId and state.** state has a state value of 1 \(WAIT\), 2\(CALLING\). The client only receives and does not receive while in a call. 
{% endhint %}

## Ssu \(session state update\)

reserved word that occurs when a session created or received by the client is updated.

```javascript
Message = {
    cmd: 'ssu',
    state: String,
    sessionId: String
}
```

{% hint style="info" %}
**state** has state values of 1\(NEW\), 2\(PENDING\), 3\(ACTIVE\), 4\(CLOSED\).

1\(NEW\): occurs when session creation is successful.

2\(PENDING\): occurs when communication request\(call\) occurs.

3\(ACTIVE\): occurs when communication accepted.

4\(CLOSED\): occurs when communication is terminated\(reject, stop\) or disconnected\(leave\).
{% endhint %}

## Notify

reserved word that the client needs to send a message to other clients.

```javascript
Message = {
    cmd: 'notify',
    opponentId: String,
    type: String
}
```

{% hint style="info" %}
**type** indicates the notification type to be transmitted. you can use it at will.
{% endhint %}

## Error

reserved word when an error occurs on the server. The client will only receive it.

See the link below for the error code.

```javascript
Message = {
    cmd: 'error',
    code: Integer
}
```

{% hint style="info" %}
**code** indicates the error code that occurred.
{% endhint %}

{% page-ref page="error-code.md" %}

