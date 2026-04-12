import { api } from '@/shared/lib/api'
import type { CollectionJobsResponse } from '@/shared/types/api'
import { PageHeader, Badge, Card, EmptyState } from '@internal/design-system'

const JOB_STATUS_LABELS: Record<string, string> = {
  PENDING: '대기중',
  RUNNING: '수집중',
  COMPLETED: '완료',
  FAILED: '실패',
}

const JOB_STATUS_BADGE_VARIANT: Record<string, 'blue' | 'green' | 'yellow' | 'red' | 'gray'> = {
  PENDING: 'gray',
  RUNNING: 'blue',
  COMPLETED: 'green',
  FAILED: 'red',
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
        <PageHeader title="수집 작업" description="채널별 주문 수집 작업 현황을 확인합니다" />
        <p style={{ color: '#F04452', fontSize: '14px' }}>수집 작업 목록을 불러오지 못했습니다.</p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="수집 작업"
        description="채널별 주문 수집 작업 현황을 확인합니다"
      />

      {data.content.length === 0 ? (
        <EmptyState
          title="수집 작업 없음"
          description="등록된 수집 작업이 없습니다."
        />
      ) : (
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E8EB', background: '#F9FAFB' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#4E5968', whiteSpace: 'nowrap' }}>
                    채널
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#4E5968', whiteSpace: 'nowrap' }}>
                    상태
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#4E5968', whiteSpace: 'nowrap' }}>
                    수집건수
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#4E5968', whiteSpace: 'nowrap' }}>
                    시작 시각
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#4E5968', whiteSpace: 'nowrap' }}>
                    완료 시각
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.content.map(job => (
                  <tr
                    key={job.id}
                    style={{ borderBottom: '1px solid #F2F4F6' }}
                  >
                    <td style={{ padding: '12px 16px', color: '#191F28', fontWeight: 500 }}>
                      {job.channelName ?? job.channelId}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge variant={JOB_STATUS_BADGE_VARIANT[job.status] ?? 'gray'}>
                        {JOB_STATUS_LABELS[job.status] ?? job.status}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: '#4E5968' }}>
                      {job.collectedCount !== undefined ? job.collectedCount.toLocaleString() : '-'}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#4E5968', whiteSpace: 'nowrap' }}>
                      {job.startedAt ? new Date(job.startedAt).toLocaleString('ko-KR') : '-'}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#4E5968', whiteSpace: 'nowrap' }}>
                      {job.completedAt ? new Date(job.completedAt).toLocaleString('ko-KR') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
