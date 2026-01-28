import { Typography } from '@/shared';

function AuditPageComponent() {
  return (
    <div className="animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <Typography variant="h2" className="text-white">
              AUDIT
            </Typography>
            <Typography variant="small" className="text-muted-foreground font-mono">
              Quản lý các hoạt động audit của hệ thống
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditPageComponent;
