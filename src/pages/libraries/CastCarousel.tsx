import type { BaseItemPerson } from '../../api/types';

interface CastCarouselProps {
  people: BaseItemPerson[];
  title?: string;
}

function formatPersonImage(person: BaseItemPerson): string | undefined {
  if (person.PrimaryImageTag || person.ImageTag) {
    const tag = person.PrimaryImageTag || person.ImageTag;
    return `/api/items/${person.Id}/Images/Primary?tag=${tag}`;
  }
  return undefined;
}

export function CastCarousel({ people, title = 'Cast & Crew' }: CastCarouselProps) {
  if (!people || people.length === 0) {
    return null;
  }

  return (
    <div className="cast-carousel py-6">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-emby-surface scrollbar-track-transparent">
          {people.map((person) => {
            const imageSrc = formatPersonImage(person);
            const hasImage = !!imageSrc;

            return (
              <div
                key={person.Id}
                className="cast-member flex-shrink-0 w-28 text-center group"
              >
                <div className="relative mb-2 mx-auto w-24 h-24 rounded-full overflow-hidden bg-emby-surface transition-transform duration-200 group-hover:scale-105">
                  {hasImage ? (
                    <img
                      src={imageSrc}
                      alt={person.Name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-emby-surface">
                      <span className="text-2xl font-bold text-emby-text-secondary">
                        {person.Name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-white truncate">{person.Name}</p>
                {person.Role && (
                  <p className="text-xs text-emby-text-secondary truncate" title={person.Role}>
                    {person.Role}
                  </p>
                )}
                {person.Type && (
                  <p className="text-xs text-emby-text-secondary/60 truncate">
                    {person.Type}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}