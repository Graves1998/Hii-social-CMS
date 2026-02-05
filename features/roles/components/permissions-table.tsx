'use client';

import {
  Checkbox,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui';
import { PERMISSION_GROUPS } from '../constants';

interface PermissionsTableProps {
  selectedPermissions: string[];
  onPermissionToggle: (permission: string) => void;
  onGroupToggle: (groupPermissions: string[]) => void;
}

export const PermissionsTable = ({
  selectedPermissions,
  onPermissionToggle,
  onGroupToggle,
}: PermissionsTableProps) => {
  return (
    <div className="border border-white/10">
      <Table>
        <TableHeader className="bg-muted/50 sticky! top-0 z-10 backdrop-blur">
          <TableRow className="border-b border-white/10">
            <TableHead className="p-4 text-left text-sm font-medium">Nhóm quyền</TableHead>
            <TableHead className="p-4 text-left text-sm font-medium">Quyền hạn</TableHead>
            <TableHead className="w-20 p-4 text-center text-sm font-medium">Chọn</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PERMISSION_GROUPS.map((group, groupIndex) => {
            const groupPermissionValues = group.permissions.map((p) => p.value);
            const allSelected = groupPermissionValues.every((p) =>
              selectedPermissions?.includes(p)
            );
            const someSelected = groupPermissionValues.some((p) =>
              selectedPermissions?.includes(p)
            );

            return (
              <>
                {/* Group Header Row */}
                <TableRow
                  key={`group-${group.label}`}
                  className={`bg-muted/30 border-b border-white/10 ${groupIndex > 0 ? 'border-t-2 border-t-white/10' : ''}`}
                >
                  <TableCell className="p-4" colSpan={2}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`group-${group.label}`}
                        checked={allSelected}
                        onCheckedChange={() => onGroupToggle(groupPermissionValues)}
                        className={someSelected && !allSelected ? 'opacity-50' : ''}
                      />
                      <Label
                        htmlFor={`group-${group.label}`}
                        className="cursor-pointer font-semibold"
                      >
                        {group.label}
                      </Label>
                    </div>
                  </TableCell>
                  <TableCell className="p-4 text-center">
                    <span className="text-muted-foreground text-xs">
                      {
                        selectedPermissions.filter((p) => groupPermissionValues.includes(p as any))
                          .length
                      }
                      /{group.permissions.length}
                    </span>
                  </TableCell>
                </TableRow>

                {/* Permission Rows */}
                {group.permissions.map((permission, permIndex) => (
                  <TableRow
                    key={permission.value}
                    className={`hover:bg-muted/50 border-b border-white/5 transition-colors ${
                      permIndex === group.permissions.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <TableCell className="text-muted-foreground p-4 pl-12 text-sm">
                      <code className="bg-muted rounded px-2 py-1 text-xs">{permission.value}</code>
                    </TableCell>
                    <TableCell className="p-4 text-sm">{permission.label}</TableCell>
                    <TableCell className="p-4 text-center">
                      <Checkbox
                        id={permission.value}
                        checked={selectedPermissions?.includes(permission.value)}
                        onCheckedChange={() => onPermissionToggle(permission.value)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
