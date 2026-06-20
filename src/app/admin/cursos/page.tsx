import { db } from '@/lib/db'
import { PageHeader } from '@/components/app/PageHeader'
import { CoursesManager } from '@/components/admin/CoursesManager'

export default async function AdminCoursesPage() {
  const courses = await db.courses.all({ includeUnpublished: true })
  return (
    <div>
      <PageHeader
        eyebrow="Contenido"
        title="Gestión de cursos"
        description="Crea cursos, sube videos y administra la biblioteca."
      />
      <CoursesManager courses={courses} />
    </div>
  )
}
