var EventTarget = require("twixt-event-target"),
    MutationEvent = require("twixt-mutation-event"),
    proxies = new WeakMap();

/**
 * Create a object proxy that dispatches mutation events.
 * @param {object} obj
 * @returns {Mutant}
 */
function Mutant(obj) {
    var triggered,
        i = 0;
        mutations = {};

    if (!obj.addEventListener) {
        obj = EventTarget(obj);
    }
    
    function trigger() {
        i++;
        
        if (triggered) return;
        
        triggered = setTimeout(function() {
            var evt = new MutationEvent(mutations, i);

            triggered = null;
            mutations = {};
            i = 0;

            obj.dispatchEvent(evt);
        }, 0);
    }
    
    return new Proxy(obj, {
        deleteProperty: function(target, property) {
            if (property in target) {
                if (!(property in mutations)) {
                    mutations[property] = target[property];
                }
                
                delete target[property];
                trigger();
            }
            
            return true;
        },
        defineProperty: function(target, property, descriptor) {
            var value = target[property];
            
            Object.defineProperty(target, property, descriptor);

            if (!(property in mutations)) {
                if (target[property] !== value) {
                    mutations[property] = value;
                    trigger();
                }
            }
        },
        set: function(target, property, value, receiver) {
            if (value !== target[property]) {
                if (!(property in mutations)) {
                    mutations[property] = target[property];
                }
                
                target[property] = value;
                trigger();
            }
        }
    });
}

/**
 * Return a Mutant proxy for the object.
 * @param {object} obj
 * @returns {Mutant}
 */
function mutant(obj) {
    if (!proxies.has(obj)) {
        proxies.set(obj, Mutant(obj));
    }
    
    return proxies.get(obj);
}

module.exports = mutant;;

