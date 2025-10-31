import { useState, useRef, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash2, Settings, Edit2, Copy } from "react-feather";
import { ChevronsUpDown, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SortDirection = "asc" | "desc" | "default";

interface SortState {
  column: string | null;
  direction: SortDirection;
}

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  tags: string[];
  createdAt: string;
  lastActive: string;
  updatedBy: string;
}

const mockContacts: Contact[] = [
  {
    id: "C001",
    name: "Alice Johnson",
    phoneNumber: "+1-555-0101",
    tags: ["VIP", "Active"],
    createdAt: "2024-10-15",
    lastActive: "2024-10-30",
    updatedBy: "John Smith",
  },
  {
    id: "C002",
    name: "Bob Smith",
    phoneNumber: "+1-555-0102",
    tags: ["Inactive"],
    createdAt: "2024-09-20",
    lastActive: "2024-10-25",
    updatedBy: "Sarah Johnson",
  },
  {
    id: "C003",
    name: "Carol White",
    phoneNumber: "+1-555-0103",
    tags: ["VIP"],
    createdAt: "2024-08-10",
    lastActive: "2024-10-28",
    updatedBy: "Mike Davis",
  },
];

export default function ContactsSection() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sort, setSort] = useState<SortState>({ column: null, direction: "default" });
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showView, setShowView] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    phoneNumber: true,
    tags: true,
    createdAt: true,
    lastActive: true,
    updatedBy: true,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const viewDropdownRef = useRef<HTMLDivElement>(null);
  const [rowsDropdownOpen, setRowsDropdownOpen] = useState(false);

  const renderSortIcon = (column: string) => {
    const isActive = sort.column === column;
    const color = isActive ? "text-foreground" : "text-muted-foreground";

    if (sort.column !== column) {
      return <div className="w-4 h-4 flex items-center justify-center"><ChevronsUpDown size={14} className={color} /></div>;
    }
    if (sort.direction === "asc") {
      return <div className="w-4 h-4 flex items-center justify-center"><ChevronUp size={14} className={color} /></div>;
    }
    if (sort.direction === "desc") {
      return <div className="w-4 h-4 flex items-center justify-center"><ChevronDown size={14} className={color} /></div>;
    }
    return <div className="w-4 h-4 flex items-center justify-center"><ChevronsUpDown size={14} className={color} /></div>;
  };

  const handleSort = (column: string) => {
    setSort((prev) => {
      if (prev.column === column) {
        if (prev.direction === "default") return { column, direction: "asc" };
        if (prev.direction === "asc") return { column, direction: "desc" };
        return { column: null, direction: "default" };
      }
      return { column, direction: "asc" };
    });
  };

  const getSortedData = () => {
    let sorted = [...mockContacts];

    if (sort.column && sort.direction !== "default") {
      sorted.sort((a, b) => {
        const aVal = a[sort.column as keyof Contact];
        const bVal = b[sort.column as keyof Contact];

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sort.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        return 0;
      });
    }

    return sorted.filter(item =>
      search === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.phoneNumber.toLowerCase().includes(search.toLowerCase())
    );
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRowsDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSort(false);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
      if (viewDropdownRef.current && !viewDropdownRef.current.contains(event.target as Node)) {
        setShowView(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card className="shadow-[0_-3px_6px_rgba(0,0,0,0.04),-3px_0_6px_rgba(0,0,0,0.04),3px_0_6px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.1)] border-0">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Contacts</CardTitle>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white gap-2 h-9">
              <Plus size={16} />
              Add Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-9 text-sm w-full border border-border rounded-md bg-background"
          />
        </div>

        <button className="px-3 py-2 text-sm border border-border rounded-md hover:bg-muted flex items-center gap-2">
          <span>Tags</span>
          <ChevronDown size={14} />
        </button>

        <button className="px-3 py-2 text-sm border border-border rounded-md hover:bg-muted flex items-center gap-2">
          <span>Created At</span>
          <ChevronDown size={14} />
        </button>

        <button className="px-3 py-2 text-sm border border-border rounded-md hover:bg-muted flex items-center gap-2">
          <span>Last Active</span>
          <ChevronDown size={14} />
        </button>

        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setShowSort(!showSort)}
            className="px-3 py-2 text-sm border border-border rounded-md hover:bg-muted flex items-center gap-2"
          >
            <span>Sort</span>
          </button>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="px-3 py-2 text-sm border border-border rounded-md hover:bg-muted flex items-center gap-2"
          >
            <span>Filter</span>
          </button>
          <button
            onClick={() => setShowView(!showView)}
            className="px-3 py-2 text-sm border border-border rounded-md hover:bg-muted flex items-center gap-2"
            ref={viewDropdownRef}
          >
            <span>View</span>
            <ChevronDown size={14} />
            {showView && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-md border border-border z-10">
                <div className="p-3 border-b">
                  <input
                    type="text"
                    placeholder="Search columns..."
                    className="w-full px-2 py-1 text-xs border border-border rounded"
                  />
                </div>
                <div className="p-2">
                  {Object.entries(visibleColumns).map(([col, visible]) => (
                    <label key={col} className="flex items-center gap-2 px-2 py-2 text-sm cursor-pointer hover:bg-muted rounded">
                      <input
                        type="checkbox"
                        checked={visible}
                        onChange={(e) => setVisibleColumns({ ...visibleColumns, [col]: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span>{col.charAt(0).toUpperCase() + col.slice(1).replace(/([A-Z])/g, ' $1')}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </button>
        </div>
          </div>

          {/* Sort Panel */}
          {showSort && (
            <div className="border border-border rounded-md p-4 bg-muted/30 mt-3">
              <h3 className="font-semibold text-sm mb-3">Sort by</h3>
              <div className="flex gap-2 mb-3">
                <select className="px-3 py-2 text-sm border border-border rounded-md">
                  <option>Name</option>
                  <option>Phone Number</option>
                  <option>Created At</option>
                  <option>Last Active</option>
                </select>
                <select className="px-3 py-2 text-sm border border-border rounded-md">
                  <option>Asc</option>
                  <option>Desc</option>
                </select>
                <button className="p-2 hover:bg-muted rounded"><Trash2 size={16} /></button>
                <button className="p-2 hover:bg-muted rounded"><Settings size={16} /></button>
              </div>
              <div className="flex gap-2">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">Add sort</Button>
                <Button variant="outline">Reset sorting</Button>
              </div>
            </div>
          )}

          {/* Filter Panel */}
          {showFilter && (
            <div className="border border-border rounded-md p-4 bg-muted/30 mt-3">
              <h3 className="font-semibold text-sm mb-3">Filters</h3>
              <div className="flex gap-2 mb-3">
                <select className="px-3 py-2 text-sm border border-border rounded-md">
                  <option>Where</option>
                  <option>Name</option>
                  <option>Phone Number</option>
                </select>
                <select className="px-3 py-2 text-sm border border-border rounded-md">
                  <option>contains</option>
                  <option>equals</option>
                  <option>starts with</option>
                </select>
                <input
                  type="text"
                  placeholder="Enter a value..."
                  className="px-3 py-2 text-sm border border-border rounded-md flex-1"
                />
                <button className="p-2 hover:bg-muted rounded"><Trash2 size={16} /></button>
                <button className="p-2 hover:bg-muted rounded"><Settings size={16} /></button>
              </div>
              <div className="flex gap-2">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">Add filter</Button>
                <Button variant="outline">Reset filters</Button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                    <input type="checkbox" className="w-4 h-4" />
                  </th>
                  {visibleColumns.name && (
                    <th
                      className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        Name
                        {renderSortIcon("name")}
                      </div>
                    </th>
                  )}
                  {visibleColumns.phoneNumber && (
                    <th
                      className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                      onClick={() => handleSort("phoneNumber")}
                    >
                      <div className="flex items-center gap-2">
                        Phone Number
                        {renderSortIcon("phoneNumber")}
                      </div>
                    </th>
                  )}
                  {visibleColumns.tags && (
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">Tags</th>
                  )}
                  {visibleColumns.createdAt && (
                    <th
                      className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-2">
                        Created At
                        {renderSortIcon("createdAt")}
                      </div>
                    </th>
                  )}
                  {visibleColumns.lastActive && (
                    <th
                      className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                      onClick={() => handleSort("lastActive")}
                    >
                      <div className="flex items-center gap-2">
                        Last Active
                        {renderSortIcon("lastActive")}
                      </div>
                    </th>
                  )}
                  {visibleColumns.updatedBy && (
                    <th
                      className="text-left py-2 px-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/30"
                      onClick={() => handleSort("updatedBy")}
                    >
                      <div className="flex items-center gap-2">
                        Updated by
                        {renderSortIcon("updatedBy")}
                      </div>
                    </th>
                  )}
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getSortedData().length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">
                      No results
                    </td>
                  </tr>
                ) : (
                  getSortedData().map((contact) => (
                    <tr key={contact.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-3">
                        <input type="checkbox" className="w-4 h-4" />
                      </td>
                      {visibleColumns.name && <td className="py-2 px-3">{contact.name}</td>}
                      {visibleColumns.phoneNumber && <td className="py-2 px-3">{contact.phoneNumber}</td>}
                      {visibleColumns.tags && (
                        <td className="py-2 px-3">
                          <div className="flex gap-1">
                            {contact.tags.map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-muted rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                      )}
                      {visibleColumns.createdAt && <td className="py-2 px-3">{contact.createdAt}</td>}
                      {visibleColumns.lastActive && <td className="py-2 px-3">{contact.lastActive}</td>}
                      {visibleColumns.updatedBy && <td className="py-2 px-3">{contact.updatedBy}</td>}
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-muted rounded" title="Edit">
                            <Edit2 size={14} className="text-muted-foreground hover:text-foreground" />
                          </button>
                          <button className="p-1 hover:bg-muted rounded" title="Copy">
                            <Copy size={14} className="text-muted-foreground hover:text-foreground" />
                          </button>
                          <button className="p-1 hover:bg-muted rounded" title="Delete">
                            <Trash2 size={14} className="text-muted-foreground hover:text-foreground" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-xs">
            <span className="text-muted-foreground">{getSortedData().length} results</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Rows per page:</span>
              <div className="relative w-15" ref={dropdownRef}>
                <button
                  type="button"
                  className="flex items-center justify-between px-3 py-2 text-left bg-white border border-input rounded-md shadow-sm hover:bg-accent focus:outline-none text-foreground transition-colors"
                  onClick={() => setRowsDropdownOpen(!rowsDropdownOpen)}
                >
                  <span className="truncate text-xs font-normal">{rowsPerPage}</span>
                  <ChevronDown className="h-3 w-3 ml-2 text-muted-foreground" />
                </button>
                {rowsDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-md border border-border">
                    <ul className="py-1">
                      {[10, 25, 50].map(option => (
                        <li
                          key={option}
                          className="px-3 py-2 text-xs cursor-pointer hover:bg-muted"
                          onClick={() => {
                            setRowsPerPage(option);
                            setRowsDropdownOpen(false);
                          }}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <span className="text-muted-foreground">Page 1 of 1</span>
              <div className="flex gap-1">
                <button className="p-1 hover:bg-muted rounded disabled:opacity-50" disabled>
                  <ChevronsLeft size={16} />
                </button>
                <button className="p-1 hover:bg-muted rounded disabled:opacity-50" disabled>
                  <ChevronLeft size={16} />
                </button>
                <button className="p-1 hover:bg-muted rounded disabled:opacity-50" disabled>
                  <ChevronRight size={16} />
                </button>
                <button className="p-1 hover:bg-muted rounded disabled:opacity-50" disabled>
                  <ChevronsRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

