let elements = [];
let selectedElements = new Set();
let isShifted = false;
let imageSelected = false;

function addHeading() {
    const text = prompt("Enter heading text:");
    if (text) {
        const heading = document.createElement('h2');
        heading.textContent = text;
        addElement(heading, 'Heading: ' + text);
    }
}

function addParagraph() {
    const text = prompt("Enter paragraph text:");
    if (text) {
        const para = document.createElement('p');
        para.textContent = text;
        addElement(para, 'Paragraph: ' + text.substring(0, 20) + '...');
    }
}

function addImage() {
    const url = prompt("Enter image URL:");
    if (url) {
        const img = document.createElement('img');
        img.src = url;
        img.style.maxWidth = '100%';
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
            div.classList.add('selected');
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
    console.log(imageSelected);
    console.log(selectedElements.size);
}function isAnyImages() {
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
            div.classList.add('selected');
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
    if(event.shiftKey) {
        isShifted = true;
    }
}

function isKeyUp(event){
    if(event.shiftKey) {
        isShifted = false;
    }
}

function toggleElementSelection(id) {
   /* if (selectedElements.has(id)) {
        selectedElements.delete(id);
        document.getElementById(id).classList.remove('selected');
    } else {
        selectedElements.add(id);
        document.getElementById(id).classList.add('selected');
    }*/
    if (isShifted){
        selectedElements.add(id);
        document.getElementById(id).classList.add('selected');
        updateElementList();
    }
    else {
    deselectAllElements();
    selectedElements.add(id);
    document.getElementById(id).classList.add('selected');
    updateElementList()
    }
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
}

function deselectAllElements() {
    selectedElements.forEach(id => {
        document.getElementById(id).classList.remove('selected');
    });
    selectedElements.clear();
    updateElementList();
}

function applyStyle(property, value) {
    selectedElements.forEach(id => {
        const element = document.getElementById(id);
        if (element.style[property] !== value) {
            element.style[property] = value;
        } else {
            element.style[property] = '';
        }
    });
}

function applyAlign(side) {
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
}

function applyBodyStyle(property, value) {
    document.getElementById('preview').style[property] = value;
}

function generateHTML() {
    const content = document.getElementById('preview').innerHTML;
    const theBackgroundColor = document.getElementById('preview').style.backgroundColor;
    console.log(theBackgroundColor);
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