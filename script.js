let elements = [];
let selectedElement = null;

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

function updateElementList() {
    const list = document.getElementById('elementList');
    list.innerHTML = '';
    elements.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'element-item';
        div.textContent = `${index + 1}. ${item.description}`;
        div.setAttribute('draggable', true);
        div.id = `list-${item.id}`;
        div.onclick = () => selectElement(item.id);
        div.ondragstart = drag;
        div.ondragover = allowDrop;
        div.ondrop = drop;
        list.appendChild(div);
    });
}

function selectElement(id) {
    if (selectedElement) {
        document.getElementById(selectedElement).classList.remove('selected');
    }
    selectedElement = id;
    document.getElementById(id).classList.add('selected');
    updateElementList();
}

function deselectElement() {
    document.getElementById(selectedElement).classList.remove('selected');
    selectedElement = null;
}

function applyStyle(property, value) {
    if (selectedElement) {
        if (document.getElementById(selectedElement).style[property] !== value) {
            document.getElementById(selectedElement).style[property] = value;
        }
        else {
            document.getElementById(selectedElement).style[property] = 'normal';
            document.getElementById(selectedElement).style[property] = 'none';
        }
    }
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
