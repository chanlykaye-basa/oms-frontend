import { api } from '@/shared/lib/api'
import type { CollectionJobsResponse } from '@/shared/types/api'

const JOB_STATUS_LABELS: Record<string, string> = {
  PENDING: '대기중',
  RUNNING: '수집중',
  COMPLETED: '완료',
  FAILED: '실패',
}

const JOB_STATUS_COLORS: Record<string, string> = {
  PENDING: '#6c757d',
  RUNNING: '#0d6efd',
  COMPLETED: '#198754',
  FAILED: '#dc3545',
}

async function getCollectionJobs(): Promise<CollectionJobsResponse> {
  return api.get<CollectionJobsResponse>('/api/v1/collection-jobs', { cache: 'no-store' })
}

export default async function CollectionJobsPage() {
  let data: CollectionJobsResponse

  try {
    data = await getCollectionJobs()
  } catch {
    return (
      <div>
        <h1 style={{ marginBottom: '24px' }}>수집 작업</h1>
        <p style={{ color: 'red' }}>수집 작업 목록을 불러오지 못했습니다.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>수집 작업</h1>

      {data.content.length === 0 ? (
        <p style={{ color: '#999' }}>수집 작업이 없습니다.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>채널</th>
              <th style={{ padding: '8px' }}>상태</th>
              <th style={{ padding: '8px' }}>수집건수</th>
              <th style={{ padding: '8px' }}>시작 시각</th>
              <th style={{ padding: '8px' }}>완료 시각</th>
            </tr>
          </thead>
          <tbody>
            {data.content.map(job => (
              <tr key={job.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{job.channelName ?? job.channelId}</td>
                <td style={{ padding: '8px' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    backgroundColor: JOB_STATUS_COLORS[job.status] ?? '#6c757d',
                    color: 'white',
                  }}>
                    {JOB_STATUS_LABELS[job.status] ?? job.status}
                  </span>
                </td>
                <td style={{ padding: '8px' }}>{job.collectedCount?.toLocaleString() ?? '-'}</td>
                <td style={{ padding: '8px' }}>
                  {job.startedAt ? new Date(job.startedAt).toLocaleString('ko-KR') : '-'}
                </td>
                <td style={{ padding: '8px' }}>
                  {job.completedAt ? new Date(job.completedAt).toLocaleString('ko-KR') : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
