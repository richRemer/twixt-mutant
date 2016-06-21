twixt-mutant Function
=====================

```js
var Mutant = require("twixt-mutant"),
    obj = {};

Mutant(obj).addEventListener("mutate", function(evt) {
    var was, is;
    
    for (var prop in evt.mutations) {
        was = evt.mutations[prop];
        is = this[prop];
        console.log(prop, "changed from", was, "to", is);
    }
});
```

