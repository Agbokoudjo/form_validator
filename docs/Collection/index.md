::: {#wlindabla-field-collection-manager .section}
## 📌 WlindablaFieldCollectionManager

This class helps dynamically add and remove fields in a form collection
using jQuery. It's ideal for Symfony forms using `CollectionType`.

### Key Features

-   Singleton instance pattern
-   Handles dynamic collection forms
-   Custom event triggers after add/remove
-   Flexible integration via prototype system

### Events to Listen

  Event Name                                       Description
  ------------------------------------------------ ---------------------------------------------------------
  `wlindabla-collection-item-added`                Fired after a new field is added
  `wlindabla-admin-append-form-element`            Triggered when the new element is inserted into the DOM
  `wlindabla-collection-item-deleted`              Fired before a field is removed
  `wlindabla-collection-item-deleted-successful`   Fired after field is successfully removed

### Example Usage

    document.addEventListener('DOMContentLoaded', () => {
      const manager = WlindablaFieldCollectionManager.getInstance();
      manager.init('.wlindabla-collection-add', document);

      document.addEventListener('wlindabla-collection-item-added', (e) => {
        console.log('Item added:', e.target);
      });
    });
      

### Requirements

-   jQuery must be loaded on the page
-   Your collection container must have a `data-prototype` attribute
-   Fields must be added within a container using class
    `.wlindabla-collection-row`

### Author Info

**Author:** AGBOKOUDJO Franck\
**Email:** franckagbokoudjo301@gmail.com\
**LinkedIn:** [LinkedIn
Profile](https://www.linkedin.com/in/internationales-web-services-120520193/){target="_blank"}\
**Company:** INTERNATIONALES WEB SERVICES
:::

::: footer
© 2025 - Documentation powered by Wlindabla \|
www.internationaleswebservices.com
:::
