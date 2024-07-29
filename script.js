let elements = [];
let selectedElements = new Set();
let isShifted = false;
let imageSelected = false;
const menuItems = document.getElementsByClassName('menuItem');
function addHeading() {
    const text = prompt("Enter heading text:");
    if (text) {
        const heading = document.createElement('h2');
        heading.textContent = text;
        heading.style.fontSize = '24px';
        heading.style.fontFamily = 'Arial';
        heading.style.fontWeight = 700;
        addElement(heading, 'Heading: ' + text);
    }
}

function addParagraph() {
    const text = prompt("Enter paragraph text:");
    if (text) {
        const para = document.createElement('p');
        para.textContent = text;
        para.style.fontSize = '16px';
        para.style.fontFamily = 'Arial';
        para.style.fontWeight = 400;
        addElement(para, 'Paragraph: ' + text.substring(0, 20) + '...');
    }
}

function addImage() {
    const url = prompt("Enter image URL:");
    if (url) {
        const img = document.createElement('img');
        img.src = url;
        img.style.maxWidth = '100%';
        img.style.width = '25%'
        addElement(img, 'Image: ' + url.substring(0, 20) + '...');
    }
}

function addElement(element, description) {
    const id = 'element-' + elements.length;
    element.id = id;
    elements.push({ id, element, description });
    document.getElementById('preview').appendChild(element);
    updateElementList();
}

function editText() {
    const text = prompt("Enter new text:");
    selectedElements.forEach(id => {
        document.getElementById(id).innerHTML = text;
    });
    updateElementList();
}

function isAnyImages() {
    for (let i = 0; i < selectedElements.length; i++) {
        const element = document.getElementById(selectedElements[i]);
        if (element && element.tagName.toLowerCase() === 'img') {
            return true;
        }
    }
    return false;
}

function updateElementList() {
    const list = document.getElementById('elementList');
    list.innerHTML = '';
    let imageSelected = false;

    elements.forEach((item, index) => {
        const div = document.createElement('div');
        const textSpan = document.createElement('span');
        const delBtn = document.createElement('button');
        
        delBtn.textContent = 'del';
        delBtn.className = 'delBtn';
        delBtn.onclick = (event) => {
            event.stopPropagation();
            removeElement(item.id);
        };
        
        textSpan.textContent = `${index + 1}. ${item.description}`;
        
        div.className = 'element-item';
        if (selectedElements.has(item.id)) {
            div.classList.add('eleSelected');
        }
        div.appendChild(textSpan);
        div.appendChild(delBtn);
        
        div.setAttribute('draggable', true);
        div.id = `list-${item.id}`;
        div.onclick = () => toggleElementSelection(item.id);
        div.ondragstart = drag;
        div.ondragover = allowDrop;
        div.ondrop = drop;
        
        list.appendChild(div);
        
        const element = document.getElementById(item.id);
        if (element && element.tagName.toLowerCase() === 'img' && selectedElements.has(item.id)) {
            imageSelected = true;
        }
    });

    imageSelected = imageSelected || isAnyImages();
    if (imageSelected) {
        document.getElementById('imageControls').style.opacity = '1';
        document.getElementById('imageRange').disabled = false;
    } else {
        document.getElementById('imageControls').style.opacity = '0';
        document.getElementById('imageRange').disabled = true;
    }
}

function isKeyPressed(event) {
    if(event.key === 'Shift') {
        isShifted = true;
    }
}

function isKeyUp(event){
    if(event.key === 'Shift') {
        isShifted = false;
    }
}

function selectedElementsAreSame(trait) {
    if (selectedElements.size === 0) {
        return false;
    }

    let firstValue = null;
    for (let id of selectedElements) {
        const element = document.getElementById(id);
        if (!element) continue;

        const value = window.getComputedStyle(element)[trait];
        
        if (firstValue === null) {
            firstValue = value;
        } else if (value.toString() !== firstValue.toString()) {
            return false;
        }
    }
    return true;
}

function updateUIControls() {
    if (selectedElementsAreSame('fontSize')) {
        const fontSize = window.getComputedStyle(document.getElementById(elements[0].id)).fontSize;
        document.getElementById('fontSize').value = parseInt(fontSize);
    } else {
        document.getElementById('fontSize').value = '';
    }

    if (selectedElementsAreSame('fontFamily')) {
        const fontFamily = window.getComputedStyle(document.getElementById(elements[0].id)).fontFamily;
        document.getElementById('fontFamily').value = fontFamily;
    } else {
        document.getElementById('fontFamily').value = '';
    }

    if (selectedElementsAreSame('fontWeight') && document.getElementById(Array.from(selectedElements)[0]).style.fontWeight == 700) {
        document.getElementById('boldButton').toggled = true;
    } else {
        document.getElementById('boldButton').toggled = false;
    }

    if (selectedElementsAreSame('fontStyle') && document.getElementById(Array.from(selectedElements)[0]).style.fontStyle == 'italic') {
        document.getElementById('italicButton').toggled = true;
    } else {
        document.getElementById('italicButton').toggled = false;
    }

    if (selectedElementsAreSame('textDecoration') && document.getElementById(Array.from(selectedElements)[0]).style.textDecoration == 'underline') {
        document.getElementById('underlineButton').toggled = true;
    } else {
        document.getElementById('underlineButton').toggled = false;
    }

    Array.from(menuItems).forEach(updatedButtonBackground);
}

function toggleElementSelection(id) {
    const selectedElement = document.getElementById(id);
    if (isShifted) {
        selectedElements.add(id);
        selectedElement.classList.add('selected');
    } else {
        deselectAllElements();
        selectedElements.add(id);
        selectedElement.classList.add('selected');
    }
    updateElementList();
    updateUIControls();
}

function removeElement(id) {
    // Remove from DOM
    const elementToRemove = document.getElementById(id);
    if (elementToRemove) {
        elementToRemove.remove();
    }

    // Remove from elements array
    elements = elements.filter(item => item.id !== id);

    updateElementList();

    updatePreview();
}

function updatePreview() {
    const preview = document.getElementById('preview');
    preview.innerHTML = '';
    elements.forEach(item => preview.appendChild(item.element));
}

function selectAllElements() {
    // Clear current selection
    selectedElements.clear();

    // Select all elements
    elements.forEach(item => {
        selectedElements.add(item.id);
        document.getElementById(item.id).classList.add('selected');
    });

    // Update the element list to reflect the selection
    updateElementList();

    // New: Update UI controls based on selected elements
    updateUIControls();
}

function deselectAllElements() {
    selectedElements.forEach(id => {
        document.getElementById(id).classList.remove('selected');
    });
    selectedElements.clear();
    updateElementList();
}

function buttonSelection(button, type) {
    if (type === 'style') {
        button.toggled = !button.toggled;
    } else if (type === 'align') {
        //document.getElementById('leftButton').toggled = false;
        //document.getElementById('centerButton').toggled = false;
        //document.getElementById('rightButton').toggled = false;

        //button.toggled = true;
    }


    Array.from(menuItems).forEach(updatedButtonBackground);
}

    function updatedButtonBackground(item) {
        if (item.toggled) {
            item.style.backgroundColor = '#9c9ca5';
        }
        else {
            item.style.backgroundColor = '#fff'
        }
    }

function applyStyle(property, value, button, alternative) {
    selectedElements.forEach(id => {
        const element = document.getElementById(id);
        if (button){
            if (!button.toggled) {
                element.style[property] = value;
            } else {
                if (alternative) {
                element.style[property] = alternative;
                } else {
                element.style[property] = '';
                }
            }
        } else {
            element.style[property] = value;
        }
    });
    if (button) {
        buttonSelection(button, 'style')
    }
}

function applyAlign(side, button) {
    selectedElements.forEach(id => {
        const element = document.getElementById(id);
        if (element && element.tagName.toLowerCase() === 'img') {
            element.style.display = 'block';

            if (side == 'center'){
            element.style.marginLeft = 'auto';
            element.style.marginRight = 'auto';
            } else if (side == 'right') {
            element.style.marginLeft = 'auto';
            element.style.marginRight = '0%';
            } else if (side == 'left') {
            element.style.marginLeft = '0%';
            element.style.marginRight = 'auto';
            }
        } else {
            element.style.textAlign = side;
        }
    });
    if (button) {
        buttonSelection(button, 'align')
    }
}

function applyBodyStyle(property, value) {
    document.getElementById('preview').style[property] = value;
}

function generateHTML() {
    const content = document.getElementById('preview').innerHTML;
    const theBackgroundColor = document.getElementById('preview').style.backgroundColor;
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
</head>
<body style="background-color: ${theBackgroundColor}">
    ${content}
</body>
</html>
            `;
    const blob = new Blob([html], {type: 'text/html'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_website.html';
    a.click();
    URL.revokeObjectURL(url);
}


function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    ev.target.classList.add('dragging');
}

function allowDrop(ev) {
    ev.preventDefault();
    this.classList.add('drag-over');
}

function drop(ev) {
    ev.preventDefault();
    const draggedId = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(draggedId);
    const dropTarget = ev.target.closest('.element-item');

    if (draggedElement && dropTarget && draggedElement !== dropTarget) {
        const draggedIndex = Array.from(elementList.children).indexOf(draggedElement);
        const dropIndex = Array.from(elementList.children).indexOf(dropTarget);

        if (draggedIndex < dropIndex) {
            dropTarget.parentNode.insertBefore(draggedElement, dropTarget.nextSibling);
        } else {
            dropTarget.parentNode.insertBefore(draggedElement, dropTarget);
        }

        // Update the elements array to reflect the new order
        const [reorderedElement] = elements.splice(draggedIndex, 1);
        elements.splice(dropIndex, 0, reorderedElement);

        // Update the preview to reflect the new order
        const preview = document.getElementById('preview');
        preview.innerHTML = '';
        elements.forEach(item => preview.appendChild(item.element));

        updateElementList();
    }

    draggedElement.classList.remove('dragging');
    dropTarget.classList.remove('drag-over');
}