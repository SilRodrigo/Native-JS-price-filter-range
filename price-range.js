function generatePriceRange(container, initial_min_value, initial_max_value, callback) {    
    if (!container
        || !container instanceof HTMLDivElement
        || !parseInt(initial_min_value)
        || !parseInt(initial_max_value)
        || initial_min_value >= initial_max_value) return alert('Error price-range-filter: Invalid parameters.');

    let min_rect, min_range, min_range_offset, current_min_value,
        max_rect, max_range, max_range_offset, current_max_value,
        range_is_active;

    container.innerHTML =
        `<div id="price_range_component" data-min="0" data-max="100">
            <div class="button-container min-container">
                <div id="min_button" data-display="1" data-value="1" class="pointer price-button"></div>
            </div>
            <div class="button-container max-container">
                <div id="max_button" data-display="100" data-value="100" class="pointer price-button"></div>
            </div>
        </div>`;

    min_rect = min_button.parentElement.getBoundingClientRect();
    min_range = (min_rect.x + parseInt(min_rect.width / 2));
    max_rect = max_button.parentElement.getBoundingClientRect();
    max_range = (max_rect.x + parseInt(max_rect.width / 2));
    min_button.dataset.display = initial_min_value;
    max_button.dataset.display = initial_max_value;    

    function calculateRanges() {
        min_rect = min_button.parentElement.getBoundingClientRect();
        min_range_offset = (min_button.parentElement.offsetParent.clientWidth - min_rect.width) - (min_button.parentElement.offsetLeft);
        max_rect = max_button.parentElement.getBoundingClientRect();
        max_range_offset = max_button.parentElement.offsetLeft;

        current_min_value = parseInt(min_button.dataset.value);
        current_max_value = parseInt(max_button.dataset.value);

        price_range_component.dataset.min = min_range_offset;
        price_range_component.dataset.max = max_range_offset;
    }

    min_button.addEventListener('mousedown', () => {
        range_is_active = true;

        document.body.onmousemove = e => {
            let coord = e.clientX - min_range;
            if (coord < 0) coord = 0;
            if (coord >= price_range_component.dataset.max) coord = price_range_component.dataset.max - 1;
            min_button.parentElement.style.left = coord + 'px';

            if (coord === 0) coord = 1;
            let value = Math.ceil((coord * 100) / (max_range - min_range));

            value = parseInt(initial_min_value + ((initial_max_value - initial_min_value) * value * 0.01));
            if (value == current_max_value && value > initial_min_value) value = current_max_value - 1;
            min_button.dataset.value = value;
            min_button.dataset.display = value;
        }
    })

    max_button.addEventListener('mousedown', () => {
        range_is_active = true;

        document.body.onmousemove = e => {
            let coord = max_range - e.clientX;
            if (coord < 0) coord = 0;
            if (coord >= min_range_offset) coord = min_range_offset - 1;
            max_button.parentElement.style.right = coord + 'px';

            let value = Math.ceil((coord * 100) / (max_range - min_range));
            value = parseInt(initial_max_value - ((initial_max_value - initial_min_value) * value * 0.01));
            if (value <= current_min_value) value = current_min_value;
            max_button.dataset.value = value;
            max_button.dataset.display = value;
        }
    })

    function mouseUpEvent() {
        if (range_is_active) {
            range_is_active = false;
            calculateRanges();
            if (document.body.onmousemove) document.body.onmousemove = null;
            if (callback) callback({ current_min_value, current_max_value });
        }
    }

    document.body.removeEventListener('mouseup', mouseUpEvent);
    document.body.addEventListener('mouseup', mouseUpEvent);

    calculateRanges();
};
