"""set expiry for existing urls

Revision ID: 13e418400493
Revises: 36a6d361c982
Create Date: 2026-10-02 16:26:02.171545

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from datetime import timedelta
from sqlalchemy.sql import table, column
from sqlalchemy import DateTime


# revision identifiers, used by Alembic.
revision: str = '13e418400493'
down_revision: Union[str, Sequence[str], None] = '36a6d361c982'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    urls=table("urls",column("id"),column("created_at",DateTime),column("expires_at",DateTime))
    connection=op.get_bind()
    rows=connection.execute(sa.select(urls.c.id,urls.c.created_at).where(urls.c.expires_at.is_(None))).fetchall()
    for row in rows:
        connection.execute(urls.update().where(urls.c.id==row.id).values(expires_at=row.created_at+timedelta(days=30)))


def downgrade() -> None:
    """Downgrade schema."""
    pass
