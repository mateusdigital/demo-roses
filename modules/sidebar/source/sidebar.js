
const Sidebar = {};

//
// Public
//

Sidebar.create = ()=> {
    // Element
    const _dom = _make_dom("div", null, "sidebar");

    // Functions
    const _add_section = (name)=> {
        const s = Sidebar._Section(name);
        _dom.appendChild(s.dom);
        return s;
    }

    // Object
    return {
        dom:         _dom,
        add_section: _add_section,
    }
};

//------------------------------------------------------------------------------
Sidebar.Icons = {
    Restart: ()=> { return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAABmJLR0QA/wD/AP+gvaeTAAAELklEQVRogcWazW8VVRjGnzMFW2jr5wabuEAtqERIrCZuRcGFUneKiLiyfwEJK6VL48JN48I/wChp4oadtSp+FGKICwOoF8VosHFTSnuJRtL252Lmxpvp+86dz9snucnNOe/H88yZ+94z75mgCgDGJE10fXaFEJ6qErMqtuU1NMhPSLo/ZXa2PmrlYArKSd7C91UJASckfRhCWC8bYAw4AkwDZ4FFyuOFGgQBXAOmgIEyAaYrCEhjrCZBHZwHHioT5FQNYv6sKsYQBLAKTJUJVHWlaikIGfE/AKKiwaqs1OmGBQF8BGwvGrDsSh2pSVCrR55Pyogqs1J5ynqe3DuAd4C1jFzvFQ16CNgoIGaxDjEpDi8C7YycR/MG2gX8VUAM1FQQDC5PZHC5BTyaJ8iZgmKgpoLg8HkcuOnkne/lfNhx7HX71VIQMng9D6w7uSc9pwBcdJxmyK5+lXcIOUS96+RuAXdYDpOOw+/AaGJjiaq9IDiCBoHLDsdXLIdPHeOXUnZpUX17ZCDeRFuYSxvuxv6dXAKCEbhb1HQfBQXgO4PnOvBgt+FJR/mbGcE7ohotCEbeVx2ub3UbfWUYrAA7egSfpg8FIZVzGPsPd65jMAj8Yxhs+eO0B+JNahqrwEAk6YCkIcPviz7zLIJvjbFRSfsjSXscp3PN8amMi874/kjSbmfyj4bI1IHLzvgDkaR7jYl1SUvN8amGEEJb0m1j6r5I0rAxsRRC2GiWVmUsG2PDkSSMibWGydQB64JvRJJuGROjDZOpA3caY+1I0ooxMQKMNEyoNIg3yzuNqZVI0m/GRJA03iiratijmGMa1yJJPzlOTzbHpzImnPGfI0lXZJfAZ5rjUxkHjbF/Jf0oSQK+NvZGN4DBvtLMAWAIWDb4filJndbqZ4bvPZL6+miQE5OS7jbG/2+YAOPYD3jn+0YzJ4BvDJ4Ae9OGFxzDZ7eI+ybgd6U2X3jguGN8iaK95AYAbAN+cDge8xx+cRze3gINaX5eG62Fd9IHvOY4rQFbVsaBg/jN++weNzDvON4EDvRJQzeffcCSw+kcRlcqHeAR4ka4hevAvj5p6Yi57nBpA97T9qZAbzhBSK5W47cf8W12I4PH60UDvp8RbA04TQPVD9hOXACyDrxmygQeAGYzgkLcaz5Uo5jD+P3rDmYpenjclWAwhyiABeBlwGqH9coxlPgu5MgzS9X9JfFKZd1+3VgGPiZ+C2SC5NQiFW80mZtKbL3DrDRmKLsyjrAT+NUvC6vEr9ssJt+Log0cr01IStRe4PMSpMpinryluYKoQHwCcLVBIS3ynnLXKGwAOEa+H3NeLBBfrOJvYSXI3jbkFzcu6aik5yQ9LWnzmaeN25IuSJqTdCaEcLUql1oEdQPYKekxxZ2ZhyWNSLormV6R1Jb0q6SWpCshhL/rzP8fUHaDCxEM65MAAAAASUVORK5CYII="; },
    About  : ()=> { return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAADJ0lEQVRoge2ay04UQRSGv1ITBm9RFATcgRJZmBhdgrjRBKJvgDyAiRqJJPgMLjQkLlzjQyjBmCjowuvGqJHLDhSJd41iIL+L6iY1Mz0XuqunxfAlk5yu6Tl1/q6u6tNnCjb4tzC+HElqAHqAbqATaAeagG3BKT+BBWAWeAU8BO4bYz77iiE2knKSBiSNS1rR2lmWNCbprKRcFgLqJQ1Jmo8RfCnmJV2WVF8rEWckzXoUUMiMpNNpCshJGklRQCGjkrb6FtEi6UUNRYQ8ldTsS0Sb7HBnxbSktkpxll1+JTUBk8BBL1clPrNAlzHmfakTSgqRXT0eAUdSCCwOz7Fifkd9uanMD0dIJuIPMAzsDz5Xgra4HAWur+kXsktsUoYj/A578NtXrYh6+ZncLRG+mz34nVZEFhB1a50HKq4SVRA1/zZ78NsOnCtszBMSKB300BnAQJVtcRiKGpVVZBNAXyzJzonW4DMctPmi343dFAgZB056umppM2aM6Q0PVoXIvk98wM99XAtWgL3GmC+QP0dOsH5EgI21JzxwhXTVPpbEdIfGFqex05d3Y0xk6iNJvvoIOBQa7ohknRjGoSM0XCF7fHkP10df/srQEBqukO016Ng3O0OjXPa7rnCF/Mgsivh8Cw1XyMcMAknKp9BwhUxlEEhS3oaGK+R1BoEk5U1ouEImMwgkKROh4SaNu4FFPOZbhU94z8+WZWzS+BWcEQmq4vc8dpQ2d0MRUPwcGa1xMEm45R4UDn0dthjW6qOnFG+td0CbW+PKGxFjzBJwzVNnaXK1sFBXlG7LVhhfkqCSUiqNd/pIMjLTwOFCIUW5ljHmF3AxQUdpc6FU2TQSSTc9Vjx8caNUvOWK2DnsQ/LYmq5XejwBjgfzuIhK93IjVkxHufNqwAy2Er9Q6oSy7yPGmEWgL3CUFTPAqXIiqka2+PwsgznxWNK+5NciX0ydav9naHp/VUvqky3tp8WUpN7KkfgRk5M0KGnOo4A5SZeU0Q6IOtntF3dkt2OslWVJtyX1y+Z5sfG5qWYX+ZtqDgCNwI7glO/Y950p7JvdBPDATcU3+J/4C3efcF1WT4NCAAAAAElFTkSuQmCC"; },
    More   : ()=> { return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAADJ0lEQVRoge2ay04UQRSGv1ITBm9RFATcgRJZmBhdgrjRBKJvgDyAiRqJJPgMLjQkLlzjQyjBmCjowuvGqJHLDhSJd41iIL+L6iY1Mz0XuqunxfAlk5yu6Tl1/q6u6tNnCjb4tzC+HElqAHqAbqATaAeagG3BKT+BBWAWeAU8BO4bYz77iiE2knKSBiSNS1rR2lmWNCbprKRcFgLqJQ1Jmo8RfCnmJV2WVF8rEWckzXoUUMiMpNNpCshJGklRQCGjkrb6FtEi6UUNRYQ8ldTsS0Sb7HBnxbSktkpxll1+JTUBk8BBL1clPrNAlzHmfakTSgqRXT0eAUdSCCwOz7Fifkd9uanMD0dIJuIPMAzsDz5Xgra4HAWur+kXsktsUoYj/A578NtXrYh6+ZncLRG+mz34nVZEFhB1a50HKq4SVRA1/zZ78NsOnCtszBMSKB300BnAQJVtcRiKGpVVZBNAXyzJzonW4DMctPmi343dFAgZB056umppM2aM6Q0PVoXIvk98wM99XAtWgL3GmC+QP0dOsH5EgI21JzxwhXTVPpbEdIfGFqex05d3Y0xk6iNJvvoIOBQa7ohknRjGoSM0XCF7fHkP10df/srQEBqukO016Ng3O0OjXPa7rnCF/Mgsivh8Cw1XyMcMAknKp9BwhUxlEEhS3oaGK+R1BoEk5U1ouEImMwgkKROh4SaNu4FFPOZbhU94z8+WZWzS+BWcEQmq4vc8dpQ2d0MRUPwcGa1xMEm45R4UDn0dthjW6qOnFG+td0CbW+PKGxFjzBJwzVNnaXK1sFBXlG7LVhhfkqCSUiqNd/pIMjLTwOFCIUW5ljHmF3AxQUdpc6FU2TQSSTc9Vjx8caNUvOWK2DnsQ/LYmq5XejwBjgfzuIhK93IjVkxHufNqwAy2Er9Q6oSy7yPGmEWgL3CUFTPAqXIiqka2+PwsgznxWNK+5NciX0ydav9naHp/VUvqky3tp8WUpN7KkfgRk5M0KGnOo4A5SZeU0Q6IOtntF3dkt2OslWVJtyX1y+Z5sfG5qWYX+ZtqDgCNwI7glO/Y950p7JvdBPDATcU3+J/4C3efcF1WT4NCAAAAAElFTkSuQmCC"; },
    IDDQD  : ()=> { return "data:image/png;base64,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"; },
}



//------------------------------------------------------------------------------
function _make_dom(tag, id, class_name, inner_text)
{
    const dom = document.createElement(tag);
    if(id)         { dom.id = id;                }
    if(class_name) { dom.className = class_name; }
    if(inner_text) { dom.innerText = inner_text; }
    return dom;
}

//------------------------------------------------------------------------------
Sidebar._Section = (name)=> {
    // Element
    const _dom = _make_dom("ul", null, "section");
    _dom.appendChild(
        _make_dom("li", null, "title", name)
    );

    // Functions
    const _add_button = (...args)=> {
        const s = Sidebar._Button(...args);
        _dom.appendChild(s.dom);
        return s;
    }

    const _add_toggle = (...args)=> {
        const s = Sidebar._Toggle(...args);
        _dom.appendChild(s.dom);
        return s;
    }

    // Object
    return {
        dom:        _dom,
        add_button: _add_button,
        add_toggle: _add_toggle,
    }
}

//------------------------------------------------------------------------------
Sidebar._Button = (name, img_src)=> {
    // Element
    const _dom = document.createElement("li");
    const _img = document.createElement("img");
    const _txt = document.createElement("span");

    _dom.className = "button";

    _img.className = "icon";
    _img.src       = img_src;

    _txt.innerText = name;

    _dom.appendChild(_img);
    _dom.appendChild(_txt);

    if(!img_src) {
        _img.style.visibility = "hidden";
    }

    // Functions
    const _on_click = (func)=> {
        _dom.onclick= ()=> {
            func(_dom);
        }
    }

    // Object
    return {
        dom:      _dom,
        on_click: _on_click,
    }
}

//------------------------------------------------------------------------------
Sidebar._Toggle = (name, img_src, toggled)=> {
    // Element
    const _dom = document.createElement("li");
    const _img = document.createElement("img");
    const _txt = document.createElement("span");

    _dom.className = "button";

    _img.className = "icon";
    _img.src       = img_src;

    _txt.innerText = name;

    _dom.appendChild(_img);
    _dom.appendChild(_txt);

    if(!img_src) {
        _img.style.visibility = "hidden";
    }

    // Toggle widget
    const label = document.createElement("label");
    const input = document.createElement("input");
    const span  = document.createElement("span");

    label.className = "switch";
    input.type      = "checkbox";
    span .className = "slider round";

    label.appendChild(input);
    label.appendChild(span);

    _dom.appendChild(label);

    // Functions
    const _on_value_changed = (func)=> {
        input.onchange = ()=> {
            func(_dom, input.checked);
        }
    }

    // Object
    return {
        dom:              _dom,
        on_value_changed: _on_value_changed,
    }
}
