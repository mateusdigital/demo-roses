
const Sidebar = {};

//
// Public
//

Sidebar.create = ()=> {
    const sidebar = {};

    // Object
    sidebar.dom     = _make_element("div", null, "sidebar");
    sidebar.is_open = false;

    // Functions
    sidebar.add_section = (name)=> {
        const s = Sidebar._Section(name);
        sidebar.dom.appendChild(s.dom);
        return s;
    }

    sidebar.on_close = (f)=> {
         sidebar.dom.onclick = f;
         return sidebar;
    }

    sidebar.create_hamburger = (normal_text, active_text, callback) => {
        const hamburger = document.createElement("span")
        hamburger.classList.add("hamburger");
        hamburger.innerText = normal_text;

        hamburger.onclick = ()=> {
            sidebar.is_open     = !sidebar.is_open;
            hamburger.innerHTML = (sidebar.is_open) ? active_text : normal_text;

            callback();
        }

        return hamburger;
    }

     return sidebar;
};


//------------------------------------------------------------------------------
Sidebar.Icons = {
    Restart: ()=> { return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAABmJLR0QA/wD/AP+gvaeTAAAELklEQVRogcWazW8VVRjGnzMFW2jr5wabuEAtqERIrCZuRcGFUneKiLiyfwEJK6VL48JN48I/wChp4oadtSp+FGKICwOoF8VosHFTSnuJRtL252Lmxpvp+86dz9snucnNOe/H88yZ+94z75mgCgDGJE10fXaFEJ6qErMqtuU1NMhPSLo/ZXa2PmrlYArKSd7C91UJASckfRhCWC8bYAw4AkwDZ4FFyuOFGgQBXAOmgIEyAaYrCEhjrCZBHZwHHioT5FQNYv6sKsYQBLAKTJUJVHWlaikIGfE/AKKiwaqs1OmGBQF8BGwvGrDsSh2pSVCrR55Pyogqs1J5ynqe3DuAd4C1jFzvFQ16CNgoIGaxDjEpDi8C7YycR/MG2gX8VUAM1FQQDC5PZHC5BTyaJ8iZgmKgpoLg8HkcuOnkne/lfNhx7HX71VIQMng9D6w7uSc9pwBcdJxmyK5+lXcIOUS96+RuAXdYDpOOw+/AaGJjiaq9IDiCBoHLDsdXLIdPHeOXUnZpUX17ZCDeRFuYSxvuxv6dXAKCEbhb1HQfBQXgO4PnOvBgt+FJR/mbGcE7ohotCEbeVx2ub3UbfWUYrAA7egSfpg8FIZVzGPsPd65jMAj8Yxhs+eO0B+JNahqrwEAk6YCkIcPviz7zLIJvjbFRSfsjSXscp3PN8amMi874/kjSbmfyj4bI1IHLzvgDkaR7jYl1SUvN8amGEEJb0m1j6r5I0rAxsRRC2GiWVmUsG2PDkSSMibWGydQB64JvRJJuGROjDZOpA3caY+1I0ooxMQKMNEyoNIg3yzuNqZVI0m/GRJA03iiratijmGMa1yJJPzlOTzbHpzImnPGfI0lXZJfAZ5rjUxkHjbF/Jf0oSQK+NvZGN4DBvtLMAWAIWDb4filJndbqZ4bvPZL6+miQE5OS7jbG/2+YAOPYD3jn+0YzJ4BvDJ4Ae9OGFxzDZ7eI+ybgd6U2X3jguGN8iaK95AYAbAN+cDge8xx+cRze3gINaX5eG62Fd9IHvOY4rQFbVsaBg/jN++weNzDvON4EDvRJQzeffcCSw+kcRlcqHeAR4ka4hevAvj5p6Yi57nBpA97T9qZAbzhBSK5W47cf8W12I4PH60UDvp8RbA04TQPVD9hOXACyDrxmygQeAGYzgkLcaz5Uo5jD+P3rDmYpenjclWAwhyiABeBlwGqH9coxlPgu5MgzS9X9JfFKZd1+3VgGPiZ+C2SC5NQiFW80mZtKbL3DrDRmKLsyjrAT+NUvC6vEr9ssJt+Log0cr01IStRe4PMSpMpinryluYKoQHwCcLVBIS3ynnLXKGwAOEa+H3NeLBBfrOJvYSXI3jbkFzcu6aik5yQ9LWnzmaeN25IuSJqTdCaEcLUql1oEdQPYKekxxZ2ZhyWNSLormV6R1Jb0q6SWpCshhL/rzP8fUHaDCxEM65MAAAAASUVORK5CYII="; },
    About  : ()=> { return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAABmJLR0QA/wD/AP+gvaeTAAAEfUlEQVRoge2aW4hVVRjHf99xzErtYqlZpmWmqWk3b5EPUWo3gnqop16TKHqIwILqKbDnniKKILMLpVEPlYZWVF4IJROsLEtRE+/l5Ggjzvx62GfwuM+eGT17nRkf/MFhYO01/2/992Xt9X1rB4lQBwMzgNuBScA4YAwwBBha7fZv9bcT+BP4GVgLrI+ItlRjaRh1mLpAXaEet3GOq8vVx9VL+8PIVPVN9WgJE93Rpr6hTukLI9eo76gdTTCSp0N9Wx3bDCMVs1vrSB8YyXNUfU4dkMrMFeq3/WAkzzfqiLJmblN39rORWnaot/Y05ujBzBzgM+CiUmcloxPYArQDU4CBJbQOA/dHxJrT/g91tumel+/VqTXao9VlJTVb1Rmna2asuqdkwC52q3VXWB2grk+gfXVeu5ILNBBYCow87cvZM59GRGu+MSI6gPdKao8ClqottY2VXKcXgeklA9XSnlCriJnA84VH1Ostt3wp4tfqVc/HCnVNohjt6rgiQx8mCpBniTqsJk6LuihxjPe79KMaZCLwCz1M4yVpBb6r/r2DbBWeEoGJEfF71wP1JM0zA9m77IEm6gfwBPBsmK2R9gKXNTFgX7APGNUCzCKtmePAOrLEbTcwGLgFeBA4P2GcPCOAmS3A3ESCW4DXgCURcTB/UB0JfALMThSviLktwLREYk9FxCqzVLyOiNirPkqWercU9UnAtAowOZHYQvUgcET9Wj0v3yEidgKbEsUrYnIFuDyR2Hyg631zJ9lzU8SRRPGKGF4hTXpQREc37Vc2KR7AxaH+BwxKLNwBXBIRp1wNdQhZPpNfQ6aivVINkJqNeTNV5tA8MwCHK8CBJgh/0U37/CbEqmV/BdjcBOHPu2mf14RYtWyukH4aPQT8kG9URwM3Jo6VZ1MFWJlYdGU1I81zX+I4RXxZITub+1KKdtPe7NttH7ChEhGdwLsJhbsrL92UMEYRiyOisyvBG0+2uCw7pXYCgyLiRG1jdRnURvPWcAITImJrBSAitgIfJRA+mjdTZQCZ2WbxQdXDySxVvZZsA6pszjI8IureberDwCNkZ3M98AxQV1drgHZgUkRsqzuivpSgYLGotxGoV5luS+aFngINMCvdlqFTfVUdk9O+QJ1vVgU6VjJGF2vNFRrrCiNm5dV1lF8VdwC/AXvI0uPrSJuC7wZmRcSu2sbCSo96M/AtJzd7zzZagbsiYkP+QOE0HREbgbuButrAWcBh4J4iM9BLLU6dRXb7nS3sAB6KiB+769Dbi3R82vGU4itgek9moHdDC9KNp2HagKeBeRGxv2EV9bFEU2ujnFDfsmBTqxEzE9QD/WSkTX1dndTI2OsWi2aJ2Ar6ttbdTvaMfAwsi4i/GxU6ZZarnpXlNLbd8Q+wGNhG9vHSDcBosjLZULLn9Ui13y7qP1461piFblDvVQ81cIusN/vKpLAE3C+YfXpy4gxMbFdfUZtdIzhz1IWnYaBT/Ul9WZ2uNnNzrBQtwHZgFdk9f2G1/S/gD7IsdjWwumiL5BznOHP+ByYnPY0AeSA6AAAAAElFTkSuQmCC"; },
    More   : ()=> { return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAA2UlEQVR4nO3WMQ6CMBSH8X8c4BBcUTmVXkVwksmL1FkdqIlDDX1pHxLz/ZIuWr88O1AkAAAAAAAAAAAAoJXUSxol3eMaJR3id1vqVm92kiZJzy/rGvdsoVu92S4EP8OW0/XouszaZwTfa58bdeq6zHoxRIfcqFPXZdZgiIbcqFO3uLkz/IGUR+Hv1+wmm6kDuBmiv95b3EwdwNEQPRn2enRdZm01Xxs5V0tjGMCj6zWruoVwyYtQ7a7XrGo0352D5idokHSOn5lOc4Wu16wAAAAAAAAAAAD4Gy8zdPVNWFTZ9AAAAABJRU5ErkJggg=="; },
    Dev    : ()=> { return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAABmJLR0QA/wD/AP+gvaeTAAAB/klEQVRoge2ZsUodQRSGv3NNbGwFiUUgBF8h+ABCsEkVVISQSggBMWK6gAgSwRQh6BOoICZl+jxAWjsFgwhiUmhnI3p/i73g7mT3cufedXfU+WCLM2fO8P+7l7tnZiESiUTuM+YzWZIBc8BL4NGtKPJjH1g0s9OuqiVNKDy20xobnp5edHUnbpfRdOBryHd+FTQKg/tANBQ60VDoREOhk2tI0qCk4arFlEHGkCSTtAb8BY4kLdQj6z8OgF3vKkmvnT6pKWkmlf9aaZeW8EVJU4ykxZz8YTtDP3MKLiVN1mToUFKfo3HdnZPOu1uA5zk++4AtSSPAE69H3ju/zOzKGZsDBoGpVqx00jU0ULDwY2C5Z3n+/HMHzKwp6S1wDLwCvqfzIWzS2tHMGzSzC+Bj68rwMN5Dd5loKHSioYop6jX7Wy/5fUmf2xWcFyx8AXwCdnrX6MWQOyCpAWwC88AIMJ3Ou4YOcha9At6Y2QpwUo7OjhlzWx9gHZhMxZnDUtfQhhMLeGdmP8rR581TYFU3zekS8L7jaiXbh29KGtJLSfNOvo5uW5L+SNotyBU3p2Ym4IOkZaDfzKr+iRXxrNOJub1c14ffARD637Y30VDoREOhEw2Fjq+h3D1+zWROhXwN/S5RSFlkNHXzWX8WGCeME6M9ks/6Z3ULiUQikWq4BkRt75olwvLFAAAAAElFTkSuQmCC"; },
    IDDQD  : ()=> {
        return "data:image/png;base64,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"
    },
}



//------------------------------------------------------------------------------
function _make_element(tag, id, class_name, inner_text)
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
    const section = {};

    section.dom = _make_element("ul", null, "section");
    section.dom.appendChild(_make_element("li", null, "title", name));

    // Functions
    section.add_button = (...args)=> {
        const s = Sidebar._Button(...args);
        section.dom.appendChild(s.dom);
        return s;
    }

    section.add_toggle = (...args)=> {
        const s = Sidebar._Toggle(...args);
        section.dom.appendChild(s.dom);
        return s;
    }

    return section;
}

//------------------------------------------------------------------------------
Sidebar._Button = (name, img_src)=> {
    const button = {};
    // Element
    button.dom  = document.createElement("li");
    button.dom.className = "button";

    button.img           = document.createElement("img");
    button.img.className = "icon";
    button.img.src       = img_src;
    if(!img_src) {
        button.img.style.visibility = "hidden";
    }

    button._text = document.createElement("span");
    button._text.innerText = name;

    button.dom.appendChild(button.img);
    button.dom.appendChild(button._text);

    // Functions
    button.on_click = (func)=> {
        button.dom.onclick= ()=> {
            func(button);
        }
    }
    return button;
}

//------------------------------------------------------------------------------
Sidebar._Toggle = (name, img_src, toggled)=> {
    const toggle = {};

    // Element
    toggle.dom = document.createElement("li");
    toggle.dom.className = "button";

    toggle.img           = document.createElement("img");
    toggle.img.className = "icon";
    toggle.img.src       = img_src;
    if(!img_src) {
        toggle.img.style.visibility = "hidden";
    }

    toggle._text = document.createElement("span");
    toggle._text.innerText = name;

    toggle.dom.appendChild(toggle.img);
    toggle.dom.appendChild(toggle._text);


    // Toggle widget
    const label = document.createElement("label");
    const input = document.createElement("input");
    const span  = document.createElement("span");

    label.className = "switch";
    input.type      = "checkbox";
    span .className = "slider round";

    label.appendChild(input);
    label.appendChild(span);

    toggle.dom.appendChild(label);

    // Functions
    toggle.on_value_changed = (func)=> {
        input.onchange = ()=> {
            func(toggle, input.checked);
        }
    }

    return toggle;
}
