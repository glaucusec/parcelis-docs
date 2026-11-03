import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/parcelis-api",
    },
    {
      type: "category",
      label: "System",
      link: {
        type: "generated-index",
        title: "System",
        slug: "/category/api/system",
      },
      items: [
        {
          type: "doc",
          id: "api/health",
          label: "health",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Properties",
      link: {
        type: "generated-index",
        title: "Properties",
        slug: "/category/api/properties",
      },
      items: [
        {
          type: "doc",
          id: "api/properties-list",
          label: "properties-list",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/properties-create",
          label: "properties-create",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/properties-by-id",
          label: "properties-byId",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/properties-update",
          label: "properties-update",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "api/properties-delete",
          label: "properties-delete",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api/properties-create-image-upload-url",
          label: "properties-createImageUploadUrl",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/properties-complete-image-upload",
          label: "properties-completeImageUpload",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/properties-delete-image",
          label: "properties-deleteImage",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api/properties-archive",
          label: "properties-archive",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/properties-inactivate",
          label: "properties-inactivate",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/properties-reactivate",
          label: "properties-reactivate",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/properties-update-notes",
          label: "properties-updateNotes",
          className: "api-method patch",
        },
      ],
    },
    {
      type: "category",
      label: "Tenants",
      link: {
        type: "generated-index",
        title: "Tenants",
        slug: "/category/api/tenants",
      },
      items: [
        {
          type: "doc",
          id: "api/tenants-create-image-upload-url",
          label: "tenants-createImageUploadUrl",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/tenants-complete-image-upload",
          label: "tenants-completeImageUpload",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/tenants-delete-image",
          label: "tenants-deleteImage",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Tags",
      link: {
        type: "generated-index",
        title: "Tags",
        slug: "/category/api/tags",
      },
      items: [
        {
          type: "doc",
          id: "api/tags-list",
          label: "tags-list",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/tags-create",
          label: "tags-create",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Unit options",
      link: {
        type: "generated-index",
        title: "Unit options",
        slug: "/category/api/unit-options",
      },
      items: [
        {
          type: "doc",
          id: "api/unit-options-list",
          label: "unitOptions-list",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Amenities",
      link: {
        type: "generated-index",
        title: "Amenities",
        slug: "/category/api/amenities",
      },
      items: [
        {
          type: "doc",
          id: "api/amenities-list",
          label: "amenities-list",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/amenities-update",
          label: "amenities-update",
          className: "api-method put",
        },
      ],
    },
    {
      type: "category",
      label: "Units",
      link: {
        type: "generated-index",
        title: "Units",
        slug: "/category/api/units",
      },
      items: [
        {
          type: "doc",
          id: "api/units-list",
          label: "units-list",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/units-create",
          label: "units-create",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/units-by-id",
          label: "units-byId",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/units-update",
          label: "units-update",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/units-delete",
          label: "units-delete",
          className: "api-method delete",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
