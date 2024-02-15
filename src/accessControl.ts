import {newModel, MemoryAdapter} from "casbin.js";
import {ESTABLISHMENT, HOME, USER, ADMIN, MANAGER, CAPL, CHATS} from "@/config/names";

export const model = newModel(`
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act, eft

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow)) && !some(where (p.eft == deny))

[matchers]
m = g(r.sub, p.sub) && keyMatch(r.obj, p.obj) && regexMatch(r.act, p.act)
`);

export const adapter = new MemoryAdapter(`
p, admin, ${HOME}, (list)|(create)
p, admin, ${HOME}, (show)|(edit)|(delete)

p, admin, ${ESTABLISHMENT}, (list)|(create)
p, admin, (${ESTABLISHMENT}/adminList), (list)|(create)
p, admin, (${ESTABLISHMENT}/adminList), (show)|(edit)|(delete)

p, admin, ${ESTABLISHMENT}, (show)|(edit)|(delete)
p, admin, ${ESTABLISHMENT}, update_status
p, admin, ${ESTABLISHMENT}, add_free_places

p, admin, chats, (list)|(create)
p, admin, chats, (show)|(edit)|(delete)
p, admin, chats, searchChatsByPlace

p, admin, cities, cityWithData

p, admin, news, (list)|(create)
p, admin, news, (show)|(edit)|(delete)

p, user, home, (show)
p, user, news, (show)

p, admin, establishments, adminListestablishments
p, admin, establishments, userListestablishments
p, admin, news, adminListNews

p, admin, capl, (create)
// p, admin, capl, userListReserve
p, admin, capl, (show)|(edit)|(delete)
p, admin, capl, updateUserStatus
p, admin, capl, updateestablishmentStatus

p, admin, dashboard, list

p, admin, establishment/deleteOne, delete

p, admin, my-review, list

p, admin, all-reviews, (list)|(create)
p, admin, all-reviews, (edit)|(show)|(delete)
p, admin, list, (list)|(create)
p, admin, list, (edit)|(show)|(delete)

p, admin, favorite-places, list

p, admin, all-places, (list)|(create)
p, admin, all-places, (edit)|(show)|(delete)

p, admin, dashboard/user, (list)|(create)
p, admin, dashboard/user, (edit)|(show)|(delete)

p, admin, all-news, (list)|(create)
p, admin, all-news, (edit)|(show)|(delete)

p, admin, chooseUser, choose

p, admin, top_establishments, (list)|(create)
p, admin, top_establishments, show

p, admin, profile, (list)|(create)
p, admin, profile, (edit)|(show)|(delete) 

p, admin, profileUser, (list)|(create)
p, admin, profileUser, (edit)|(show)|(delete) 

p, admin, all-places, (list)|(create)
p, admin, all-places, (show)|(edit)|(delete)

p, admin, menu, (create)
p, admin, menu, (show)|(edit)|(delete)

p, manager, menu, (show)|(edit)|(delete)
p, manager, menu, create

p, manager, chats, (list)|(create)
p, manager, chats, searchChatsByPlace

p, user, menu, show

p, manager, home, (list)|(create)
p, manager, news, (list)|(create)
p, manager, news, (edit)|(delete)|(show)
p, manager, ${ESTABLISHMENT}, (list)|(create)
p, manager, ${ESTABLISHMENT}, add_free_places
p, manager, ${ESTABLISHMENT}, (show)|(edit)|(delete)

p, manager, top_establishments, (list)|(create)
p, manager, top_establishments, show

p, manager, profile, list
p, manager, profile, edit

p, manager, establishments, userListestablishments
p, manager, news, userListNews

p, manager, capl, managerListReserve
p, manager, capl, updateestablishmentStatus
p, manager, capl, (list)|(create)
p, manager, capl, (show)|(edit)

p, manager, my-reviews, list
p, manager, favorite-places, list
p, manager, favorite-places, delete


p, user, home, (list)
p, user, news, (list)
p, user, ${ESTABLISHMENT}, (list)
p, user, ${ESTABLISHMENT}, (show)

p, user, top_establishments, (list)
p, user, top_establishments, show

p, user, profile, list
p, user, profile, edit

p, user, chats, (list)|(create)

p, user, capl, (list)|(create)
p, user, capl, (show)|(edit)
p, user, capl, userListReserve
p, user, capl, updateUserStatus

p, user, establishments, userListestablishments
p, user, news, userListNews

p, user, my-reviews, list
p, user, favorite-places, list
p, user, favorite-places, delete

`);