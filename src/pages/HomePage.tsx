import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getApiClient } from '../api/client';
import { useAuthStore } from '../store/authStore';
import type { BaseItemDto } from '../api/types';
import './HomePage.css';

export function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [items, setItems] = useState<BaseItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      if (!user) return;

      try {
        const client = getApiClient();
        const result = await client.getItems({
          userId: user.Id,
          sortBy: ['DateCreated'],
          sortOrder: 'Descending',
          limit: 20
        });
        setItems(result.Items as BaseItemDto[]);
      } catch (err) {
        console.error('Failed to load items:', err);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [user]);

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  return (
    <div className="homePage">
      <h2 className="pageTitle">
        {t('home.welcome')}, {user?.Name}
      </h2>

      <section className="section">
        <h3 className="sectionTitle">{t('home.recentlyAdded')}</h3>
        <div className="itemsGrid">
          {items.map((item) => (
            <div key={item.Id} className="itemCard">
              <div className="itemImage">
                {item.Name.charAt(0).toUpperCase()}
              </div>
              <div className="itemInfo">
                <span className="itemName">{item.Name}</span>
                <span className="itemType">{item.Type}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
