---
description: webrtc-signaling-server
---

# Message Format

## Basic format

{% code-tabs %}
{% code-tabs-item title="json.js" %}
```javascript
Message = {
    cmd: 'call',
    key_A: '1234',
    key_B: '1234'
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

* 'key:value' is one-dimensional array
* camelCase or small letter

{% hint style="info" %}
The value of 'cmd' is called 'signaling reserved word' \(Hereinafter the same\).
{% endhint %}





