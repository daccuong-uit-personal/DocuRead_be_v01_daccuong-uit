const defaultColumns = [
  {
    code: 'user',
    name: 'Người dùng',
    displayColumns: [
      { name: 'username', displayName: 'Tên đăng nhập', type: 'string', width: 180, sortable: true },
      { name: 'email', displayName: 'Email', type: 'string', width: 250, sortable: true },
      { name: 'status', displayName: 'Trạng thái', type: 'string', width: 120, sortable: true },
      { name: 'created_at', displayName: 'Ngày tạo', type: 'date', width: 160 },
    ],
    editColumns: [
      { name: 'username', displayName: 'Tên đăng nhập', type: 'string', editable: true, required: true },
      { name: 'email', displayName: 'Email', type: 'string', editable: true, required: true },
      { name: 'status', displayName: 'Trạng thái', type: 'string', editable: true },
    ],
  },
  {
    code: 'book',
    name: 'Truyện',
    displayColumns: [
      { name: 'title', displayName: 'Tên truyện', type: 'string', width: 250, sortable: true },
      { name: 'author', displayName: 'Tác giả', type: 'string', width: 180, sortable: true },
      { name: 'status', displayName: 'Trạng thái', type: 'string', width: 120, sortable: true },
      { name: 'created_at', displayName: 'Ngày tạo', type: 'date', width: 160 },
    ],
    editColumns: [
      { name: 'title', displayName: 'Tên truyện', type: 'string', editable: true, required: true },
      { name: 'author', displayName: 'Tác giả', type: 'string', editable: false },
      { name: 'status', displayName: 'Trạng thái', type: 'string', editable: true },
    ],
  },
];

module.exports = defaultColumns;