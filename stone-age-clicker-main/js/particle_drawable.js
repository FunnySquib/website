function ParticleDrawable() {}


ParticleDrawable.draw = function(particle) {

    // implement particle types here:
    if(particle.type == 1) {
        c.globalAlpha = limit(particle.life * 4, 0.0, 1.0);
        img.drawSprite("stars", particle.pos.x - 12, particle.pos.y - 12, 24, 24, particle.o, 0);
        c.globalAlpha = 1.0;
    }

};