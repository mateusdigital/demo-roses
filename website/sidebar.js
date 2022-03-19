
const Sidebar = {};

function make_dom(tag, id, class_name, inner_text)
{
    const dom = document.createElement(tag);
    if(id)         { dom.id = id;                }
    if(class_name) { dom.className = class_name; }
    if(inner_text) { dom.innerText = inner_text; }
    return dom;
}

Sidebar.create = ()=> {
    // Element
	const _dom = make_dom("div", null, "sidebar");

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

Sidebar._Section = (name)=> {
    // Element
	const _dom = make_dom("ul", null, "section");
    _dom.appendChild(
        make_dom("li", null, "title", name)
    );

    // Functions
	const _add_button = (name)=> {
        const s = Sidebar._Button(name);
		_dom.appendChild(s.dom);
		return s;
	}

	const _add_toggle= (name)=> {
        const s = Sidebar._Toggle(name);
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

Sidebar._Button = (name)=> {
    // Element
	const _dom = make_dom("li", null, "button", name)

    // Functions
	const _on_click = (func)=> {
        _dom.onclick = func;
	}

    // Object
	return {
		dom:      _dom,
		on_click: _on_click,
    }
}

Sidebar._Toggle = (name, toggled)=> {
    // Element
	const _dom = make_dom("li", null, "button", name);

    const label = make_dom("label", null, "switch");
    const input = make_dom("input");
    input.type = "checkbox";
    const span = make_dom("span", null, "slider round");
    label.appendChild(input);
    label.appendChild(span);
    _dom.appendChild(label);

    // Functions
	const _on_click = (func)=> {
        _dom.onclick = func;
	}

    // Object
	return {
		dom:      _dom,
		on_click: _on_click,
    }
}

const sidebar = Sidebar.create();

const main = sidebar.add_section("Roses");
main.add_button("Restart").on_click(()=>{

})
main.add_button("Share!").on_click(()=> {

});
main.add_button("More!").on_click(()=>{

});

main.add_toggle("OLA!");
document.body.appendChild(sidebar.dom);
